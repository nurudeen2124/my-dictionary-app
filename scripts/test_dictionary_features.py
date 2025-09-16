import asyncio
import json
from dictionary_api import DictionaryAPI

async def test_all_features():
    """Comprehensive test suite for dictionary app features"""
    print("🧪 Starting Dictionary App Feature Tests")
    print("=" * 50)
    
    api = DictionaryAPI()
    test_results = {
        "passed": 0,
        "failed": 0,
        "tests": []
    }
    
    def log_test(test_name, passed, details=""):
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status} {test_name}")
        if details:
            print(f"   {details}")
        
        test_results["tests"].append({
            "name": test_name,
            "passed": passed,
            "details": details
        })
        
        if passed:
            test_results["passed"] += 1
        else:
            test_results["failed"] += 1
    
    # Test 1: Valid word search
    print("\n📝 Testing Word Search Functionality")
    try:
        result = api.search_word("hello")
        passed = result["found"] and len(result.get("data", [])) > 0
        log_test("Valid word search (hello)", passed, 
                f"Found: {result['found']}, Entries: {len(result.get('data', []))}")
    except Exception as e:
        log_test("Valid word search (hello)", False, f"Exception: {str(e)}")
    
    # Test 2: Invalid word search
    try:
        result = api.search_word("xyzabc123")
        passed = not result["found"] and "error" in result
        log_test("Invalid word search", passed, 
                f"Correctly returned not found: {not result['found']}")
    except Exception as e:
        log_test("Invalid word search", False, f"Exception: {str(e)}")
    
    # Test 3: Empty input validation
    try:
        result = api.search_word("")
        passed = not result["found"] and "enter a word" in result.get("error", "").lower()
        log_test("Empty input validation", passed, 
                f"Error message: {result.get('error', 'None')}")
    except Exception as e:
        log_test("Empty input validation", False, f"Exception: {str(e)}")
    
    # Test 4: Word suggestions
    print("\n🔍 Testing Word Suggestions")
    try:
        suggestions = api.get_word_suggestions("app")
        passed = isinstance(suggestions, list) and len(suggestions) > 0
        log_test("Word suggestions (app)", passed, 
                f"Suggestions: {suggestions[:5]}...")
    except Exception as e:
        log_test("Word suggestions (app)", False, f"Exception: {str(e)}")
    
    # Test 5: Empty suggestions
    try:
        suggestions = api.get_word_suggestions("")
        passed = isinstance(suggestions, list) and len(suggestions) == 0
        log_test("Empty suggestions", passed, 
                f"Empty input returned {len(suggestions)} suggestions")
    except Exception as e:
        log_test("Empty suggestions", False, f"Exception: {str(e)}")
    
    # Test 6: Input validation edge cases
    print("\n🛡️ Testing Input Validation")
    test_cases = [
        ("   hello   ", True, "Whitespace trimming"),
        ("hello123", False, "Numbers in word"),
        ("a" * 60, False, "Very long word"),
        ("hello-world", True, "Hyphenated word"),
        ("can't", True, "Apostrophe in word")
    ]
    
    for word, should_be_valid, description in test_cases:
        try:
            is_valid, result = api.validate_word(word)
            passed = is_valid == should_be_valid
            log_test(f"Input validation: {description}", passed, 
                    f"Input: '{word}' -> Valid: {is_valid}")
        except Exception as e:
            log_test(f"Input validation: {description}", False, f"Exception: {str(e)}")
    
    # Test 7: Async functionality
    print("\n⚡ Testing Async Functionality")
    try:
        async with DictionaryAPI() as async_api:
            result = await async_api.search_word_async("test")
            passed = "word" in result and "found" in result
            log_test("Async word search", passed, 
                    f"Async search completed: {result.get('found', False)}")
    except Exception as e:
        log_test("Async word search", False, f"Exception: {str(e)}")
    
    # Test 8: Data structure validation
    print("\n📊 Testing Data Structure")
    try:
        result = api.search_word("computer")
        if result["found"] and result.get("data"):
            entry = result["data"][0]
            required_fields = ["word", "meanings"]
            has_required = all(field in entry for field in required_fields)
            
            # Check meanings structure
            meanings_valid = False
            if "meanings" in entry and len(entry["meanings"]) > 0:
                meaning = entry["meanings"][0]
                meanings_valid = "partOfSpeech" in meaning and "definitions" in meaning
            
            passed = has_required and meanings_valid
            log_test("Data structure validation", passed, 
                    f"Required fields: {has_required}, Meanings valid: {meanings_valid}")
        else:
            log_test("Data structure validation", False, "No data to validate")
    except Exception as e:
        log_test("Data structure validation", False, f"Exception: {str(e)}")
    
    # Test 9: Error handling
    print("\n🚨 Testing Error Handling")
    try:
        # Test with special characters that might cause issues
        result = api.search_word("@#$%")
        passed = not result["found"] and "error" in result
        log_test("Special character handling", passed, 
                f"Error handled: {'error' in result}")
    except Exception as e:
        log_test("Special character handling", False, f"Exception: {str(e)}")
    
    # Print summary
    print("\n" + "=" * 50)
    print("📊 TEST SUMMARY")
    print(f"✅ Passed: {test_results['passed']}")
    print(f"❌ Failed: {test_results['failed']}")
    print(f"📈 Success Rate: {(test_results['passed'] / (test_results['passed'] + test_results['failed']) * 100):.1f}%")
    
    if test_results['failed'] > 0:
        print("\n🔧 FAILED TESTS:")
        for test in test_results['tests']:
            if not test['passed']:
                print(f"   • {test['name']}: {test['details']}")
    
    return test_results

def test_server_endpoints():
    """Test server endpoints (requires server to be running)"""
    import requests
    
    print("\n🌐 Testing Server Endpoints")
    print("Note: This requires the Python server to be running on localhost:8000")
    
    base_url = "http://localhost:8000/api"
    
    try:
        # Test health endpoint
        response = requests.get(f"{base_url}/health", timeout=5)
        if response.status_code == 200:
            print("✅ Health endpoint working")
        else:
            print(f"❌ Health endpoint failed: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"❌ Server not running or unreachable: {str(e)}")
        return
    
    try:
        # Test search endpoint
        response = requests.get(f"{base_url}/search?word=hello", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get("found"):
                print("✅ Search endpoint working")
            else:
                print("⚠️ Search endpoint responding but no results")
        else:
            print(f"❌ Search endpoint failed: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"❌ Search endpoint error: {str(e)}")
    
    try:
        # Test suggestions endpoint
        response = requests.get(f"{base_url}/suggestions?partial=app", timeout=5)
        if response.status_code == 200:
            data = response.json()
            if data.get("suggestions"):
                print("✅ Suggestions endpoint working")
            else:
                print("⚠️ Suggestions endpoint responding but no suggestions")
        else:
            print(f"❌ Suggestions endpoint failed: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"❌ Suggestions endpoint error: {str(e)}")

if __name__ == "__main__":
    # Run async tests
    results = asyncio.run(test_all_features())
    
    # Run server tests
    test_server_endpoints()
    
    print(f"\n🎯 Overall Status: {'SUCCESS' if results['failed'] == 0 else 'NEEDS ATTENTION'}")
