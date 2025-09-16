import re
from typing import List, Dict

def clean_word(word: str) -> str:
    """Clean and normalize a word for dictionary lookup"""
    # Remove extra whitespace and convert to lowercase
    cleaned = word.strip().lower()
    
    # Remove non-alphabetic characters except hyphens and apostrophes
    cleaned = re.sub(r"[^a-zA-Z\-']", "", cleaned)
    
    return cleaned

def extract_root_word(word: str) -> str:
    """Extract the root word by removing common suffixes"""
    word = clean_word(word)
    
    # Common suffixes to remove
    suffixes = ['ing', 'ed', 'er', 'est', 'ly', 's', 'es']
    
    for suffix in suffixes:
        if word.endswith(suffix) and len(word) > len(suffix) + 2:
            return word[:-len(suffix)]
    
    return word

def get_word_stats(text: str) -> Dict[str, int]:
    """Get basic statistics about words in text"""
    words = re.findall(r'\b[a-zA-Z]+\b', text.lower())
    
    return {
        'total_words': len(words),
        'unique_words': len(set(words)),
        'average_length': sum(len(word) for word in words) / len(words) if words else 0
    }

if __name__ == "__main__":
    # Example usage
    test_word = "running"
    print(f"Original: {test_word}")
    print(f"Cleaned: {clean_word(test_word)}")
    print(f"Root: {extract_root_word(test_word)}")
    
    test_text = "The quick brown fox jumps over the lazy dog"
    stats = get_word_stats(test_text)
    print(f"Text stats: {stats}")
