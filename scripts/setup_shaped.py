#!/usr/bin/env python3
"""
Shaped API Setup Script for Hacker News Personalization

This script helps set up the Shaped API integration for the Hacker News
personalization system. It creates the dataset and model for user engagement events.
"""

import os
import json
import subprocess
import sys
from datetime import datetime, timedelta
import random

def run_command(command, description):
    """Run a shell command and handle errors"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return result.stdout
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e.stderr}")
        return None

def check_shaped_installed():
    """Check if Shaped CLI is installed"""
    try:
        result = subprocess.run(['shaped', '--version'], capture_output=True, text=True)
        return result.returncode == 0
    except FileNotFoundError:
        return False

def create_sample_events():
    """Create sample engagement events for testing"""
    events = []
    user_ids = ['1', '2', '3']  # Demo users
    story_ids = list(range(1000, 1100))  # Sample story IDs
    
    event_types = ['click', 'upvote', 'comment']
    
    # Generate 100 sample events
    for i in range(100):
        event = {
            'user_id': random.choice(user_ids),
            'item_id': str(random.choice(story_ids)),
            'event_type': random.choice(event_types),
            'timestamp': (datetime.now() - timedelta(days=random.randint(0, 30))).isoformat(),
            'metadata': {
                'direction': 'up' if random.random() > 0.5 else 'down',
                'points': random.randint(1, 500),
                'category': random.choice(['story', 'show', 'ask', 'job'])
            }
        }
        events.append(event)
    
    return events

def create_events_file():
    """Create a TSV file with sample engagement events"""
    events = create_sample_events()
    
    # Create TSV file
    with open('hn_events.tsv', 'w') as f:
        # Write header
        f.write('user_id\titem_id\tevent_type\ttimestamp\tmetadata\n')
        
        # Write events
        for event in events:
            metadata_str = json.dumps(event['metadata'])
            f.write(f"{event['user_id']}\t{event['item_id']}\t{event['event_type']}\t{event['timestamp']}\t{metadata_str}\n")
    
    print(f"📄 Created hn_events.tsv with {len(events)} sample events")
    return len(events)

def setup_shaped():
    """Set up Shaped API integration"""
    print("🚀 Setting up Shaped API integration for Hacker News personalization")
    print("=" * 60)
    
    # Check if Shaped CLI is installed
    if not check_shaped_installed():
        print("❌ Shaped CLI not found. Please install it first:")
        print("   pip install shaped")
        print("   shaped init --api-key <YOUR_API_KEY>")
        return False
    
    # Check for API key
    api_key = os.getenv('SHAPED_API_KEY')
    if not api_key:
        print("❌ SHAPED_API_KEY environment variable not set")
        print("   Please set your Shaped API key:")
        print("   export SHAPED_API_KEY=your_api_key_here")
        return False
    
    print(f"✅ Shaped CLI found and API key configured")
    
    # Create sample events file
    event_count = create_events_file()
    
    # Create dataset
    dataset_result = run_command(
        'shaped create-dataset-from-uri --name hn_engagement_events --path hn_events.tsv --type tsv',
        "Creating Shaped dataset"
    )
    
    if not dataset_result:
        return False
    
    # Create model
    model_result = run_command(
        'shaped create-model --file hn_recommendation_model.yaml',
        "Creating Shaped model"
    )
    
    if not model_result:
        return False
    
    print("\n🎉 Shaped API setup completed successfully!")
    print("\n📋 Next steps:")
    print("1. Wait for model training to complete (check Shaped dashboard)")
    print("2. Test the ranking API:")
    print("   shaped rank --model-name hn_personalization --user-id 1 --limit 10")
    print("3. Update your .env file with the model name")
    print("4. Restart your application")
    
    return True

def test_ranking():
    """Test the ranking API with a sample user"""
    print("\n🧪 Testing Shaped ranking API...")
    
    result = run_command(
        'shaped rank --model-name hn_personalization --user-id 1 --limit 5',
        "Testing ranking API"
    )
    
    if result:
        print("📊 Ranking test results:")
        print(result)
    else:
        print("❌ Ranking test failed. Make sure the model is trained.")
    
    return result is not None

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "test":
        test_ranking()
    else:
        setup_shaped() 