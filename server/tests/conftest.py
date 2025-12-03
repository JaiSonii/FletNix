import pytest
from playwright.sync_api import sync_playwright

# Assume server is running at localhost:8000
BASE_URL = "http://127.0.0.1:8000"

@pytest.fixture(scope="session")
def api_context():
    with sync_playwright() as p:
        # Create a request context with the base URL
        request_context = p.request.new_context(base_url=BASE_URL)
        yield request_context
        request_context.dispose()

@pytest.fixture(scope="module")
def auth_token(api_context):
    """
    Helper fixture that registers a user, logs them in, 
    and returns the Bearer token for other tests to use.
    """
    email = "test_user@example.com"
    password = "securepassword123"
    
    # 1. Register
    # We ignore error if user already exists
    api_context.post("/auth/register", data={
        "email": email,
        "password": password,
        "age": 25
    })
    
    # 2. Login
    response = api_context.post("/auth/login", data={
        "email": email,
        "password": password
    })
    
    if response.ok:
        data = response.json()
        return data["access_token"]
    return None