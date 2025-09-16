import json
import requests
from typing import Dict, List, Optional, Any
import asyncio
import aiohttp
from dataclasses import dataclass, asdict

@dataclass
class Phonetic:
    text: Optional[str] = None
    audio: Optional[str] = None

@dataclass
class Definition:
    definition: str
    example: Optional[str] = None
    synonyms: List[str] = None
    antonyms: List[str] = None

@dataclass
class Meaning:
    partOfSpeech: str
    definitions: List[Definition]
    synonyms: List[str] = None
    antonyms: List[str] = None

@dataclass
class DictionaryEntry:
    word: str
    phonetic: Optional[str] = None
    phonetics: List[Phonetic] = None
    meanings: List[Meaning] = None
    license: Optional[Dict[str, str]] = None
    sourceUrls: List[str] = None

class DictionaryAPI:
    def __init__(self):
        self.base_url = "https://api.dictionaryapi.dev/api/v2/entries/en"
        self.session = None
    
    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
    
    def validate_word(self, word: str) -> tuple[bool, str]:
        """Validate input word"""
        if not word or not word.strip():
            return False, "Please enter a word to search"
        
        word = word.strip()
        if len(word) > 50:
            return False, "Word is too long"
        
        if not word.replace('-', '').replace("'", '').isalpha():
            return False, "Word contains invalid characters"
        
        return True, word
    
    async def search_word_async(self, word: str) -> Dict[str, Any]:
        """Async version of word search"""
        is_valid, result = self.validate_word(word)
        if not is_valid:
            return {
                "word": word,
                "found": False,
                "error": result
            }
        
        word = result
        
        try:
            if not self.session:
                self.session = aiohttp.ClientSession()
            
            async with self.session.get(f"{self.base_url}/{word}") as response:
                if response.status == 404:
                    return {
                        "word": word,
                        "found": False,
                        "error": "Word not found in dictionary"
                    }
                
                if response.status != 200:
                    return {
                        "word": word,
                        "found": False,
                        "error": f"API request failed with status {response.status}"
                    }
                
                data = await response.json()
                processed_data = self.process_api_response(data)
                
                return {
                    "word": word,
                    "found": True,
                    "data": processed_data
                }
        
        except aiohttp.ClientError as e:
            return {
                "word": word,
                "found": False,
                "error": f"Network error: {str(e)}"
            }
        except Exception as e:
            return {
                "word": word,
                "found": False,
                "error": f"Unexpected error: {str(e)}"
            }
    
    def search_word(self, word: str) -> Dict[str, Any]:
        """Synchronous wrapper for word search"""
        return asyncio.run(self._search_word_sync(word))
    
    async def _search_word_sync(self, word: str) -> Dict[str, Any]:
        async with self as api:
            return await api.search_word_async(word)
    
    def process_api_response(self, data: List[Dict]) -> List[Dict]:
        """Process and clean API response data"""
        processed_entries = []
        
        for entry in data:
            # Process phonetics
            phonetics = []
            if entry.get('phonetics'):
                for phonetic in entry['phonetics']:
                    phonetics.append({
                        'text': phonetic.get('text'),
                        'audio': phonetic.get('audio')
                    })
            
            # Process meanings
            meanings = []
            if entry.get('meanings'):
                for meaning in entry['meanings']:
                    definitions = []
                    if meaning.get('definitions'):
                        for definition in meaning['definitions']:
                            definitions.append({
                                'definition': definition.get('definition', ''),
                                'example': definition.get('example'),
                                'synonyms': definition.get('synonyms', []),
                                'antonyms': definition.get('antonyms', [])
                            })
                    
                    meanings.append({
                        'partOfSpeech': meaning.get('partOfSpeech', ''),
                        'definitions': definitions,
                        'synonyms': meaning.get('synonyms', []),
                        'antonyms': meaning.get('antonyms', [])
                    })
            
            processed_entry = {
                'word': entry.get('word', ''),
                'phonetic': entry.get('phonetic'),
                'phonetics': phonetics,
                'meanings': meanings,
                'license': entry.get('license'),
                'sourceUrls': entry.get('sourceUrls', [])
            }
            
            processed_entries.append(processed_entry)
        
        return processed_entries
    
    def get_word_suggestions(self, partial_word: str) -> List[str]:
        """Get word suggestions for autocomplete (basic implementation)"""
        # This is a simple implementation - in production you'd use a proper word list
        common_words = [
            "apple", "application", "appreciate", "approach", "appropriate",
            "beautiful", "because", "become", "before", "beginning",
            "computer", "complete", "consider", "continue", "create",
            "different", "difficult", "discover", "discussion", "development",
            "example", "experience", "explain", "education", "environment",
            "family", "friend", "function", "future", "follow",
            "government", "group", "general", "great", "growth",
            "house", "human", "health", "history", "however",
            "important", "information", "interest", "international", "increase",
            "knowledge", "language", "learning", "level", "local",
            "management", "market", "member", "method", "money",
            "natural", "national", "necessary", "network", "number",
            "organization", "opportunity", "original", "other", "over",
            "people", "person", "place", "point", "policy",
            "question", "quality", "quite", "quickly", "quiet",
            "research", "result", "reason", "relationship", "remember",
            "student", "system", "service", "social", "special",
            "technology", "through", "together", "training", "travel",
            "understand", "university", "usually", "under", "until",
            "value", "various", "very", "view", "visit",
            "water", "world", "work", "write", "without"
        ]
        
        if not partial_word:
            return []
        
        partial_word = partial_word.lower()
        suggestions = [word for word in common_words if word.startswith(partial_word)]
        return suggestions[:10]  # Return top 10 suggestions

# Example usage and testing
if __name__ == "__main__":
    api = DictionaryAPI()
    
    # Test word search
    result = api.search_word("hello")
    print("Search result for 'hello':")
    print(json.dumps(result, indent=2))
    
    # Test word suggestions
    suggestions = api.get_word_suggestions("app")
    print(f"\nSuggestions for 'app': {suggestions}")
    
    # Test invalid input
    invalid_result = api.search_word("")
    print(f"\nInvalid input test: {invalid_result}")
