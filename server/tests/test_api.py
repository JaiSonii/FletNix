import pytest
import json

def test_health_check(api_context):
    response = api_context.get("/")
    assert response.ok
    assert response.json() == {"message": "Welcome to FletNix API. Visit /docs for Swagger UI"}

def test_login_flow(api_context):
    """Test that we can register and get a token"""
    # Use a unique email for every run to avoid conflicts
    import time
    email = f"user_{int(time.time())}@test.com"
    
    # Register
    reg_response = api_context.post("/auth/register", data=json.dumps({
        "email": email,
        "password": "pass",
        "age": 20
    }),  headers={"Content-Type": "application/json"})
    assert reg_response.ok
    
    # Login
    login_response = api_context.post("/auth/login", data=json.dumps({
        "email": email,
        "password": "pass"
    }),  headers={"Content-Type": "application/json"})
    assert login_response.ok
    data = login_response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_search_movies(api_context, auth_token):
    """Test searching for a movie (requires Auth)"""
    headers = {"Authorization": f"Bearer {auth_token}"}
    
    # Search for "Dick Johnson" (from our dummy data)
    response = api_context.get("/shows", params={"search": "Johnson"}, headers=headers)
    
    assert response.ok
    data = response.json()
    assert data["total"] > 0
    # Check that at least one result contains "Johnson"
    first_match = data["data"][0]
    assert "Johnson" in first_match["title"] or "Johnson" in first_match["director"]

def test_age_restriction(api_context):
    """
    Test that an underage user cannot see R-rated content.
    We need a fresh user for this who is UNDER 18.
    """
    email = "kid@test.com"
    api_context.post("/auth/register", data={"email": email, "password": "123", "age": 12})
    login_res = api_context.post("/auth/login", data={"email": email, "password": "123"})
    token = login_res.json()["access_token"]
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # We happen to know "Blood & Water" is TV-MA (Mature) in our dataset
    # If we search for it, it should NOT appear for the kid
    response = api_context.get("/shows", params={"search": "Blood"}, headers=headers)
    
    data = response.json()
    # Ensure no TV-MA shows are returned
    for show in data["data"]:
        assert show["rating"] not in ["R", "TV-MA", "NC-17"]

def test_get_details_and_recommendations(api_context, auth_token):
    """Test fetching details including recommendations"""
    headers = {"Authorization": f"Bearer {auth_token}"}
    
    # Get ID of the first show available
    list_resp = api_context.get("/shows", headers=headers)
    show_id = list_resp.json()["data"][0]["show_id"]
    
    # Fetch details
    detail_resp = api_context.get(f"/shows/{show_id}", headers=headers)
    assert detail_resp.ok
    
    details = detail_resp.json()
    assert "recommendations" in details
    assert isinstance(details["recommendations"], list)