from flask import Flask, request, jsonify
# from surprise import dump
from sentence_transformers import SentenceTransformer, util
import pandas as pd
import numpy as np
from flask_cors import CORS

'''

hometown
currentCity
company
school
hobbies
keyword from older post
JOB TITLE

mutual friends

'''


HOMETOWN_SAME_COUNTRY_WEIGHT = 1
CURRENT_SAME_COUNTRY_WEIGHT = 2
PER_MUTUAL_FRIEND_WEIGHT = 5
HOMETOWN_SAME_STATE_WEIGHT = 5
CURRENT_SAME_STATE_WEIGHT = 6
HOMETOWN_SAME_CITY_WEIGHT = 10
CURRENT_SAME_CITY_WEIGHT = 15
POST_WEIGHT = 20
HOBBIES_WEIGHT = 20
JOB_WEIGHT = 25
SCHOOL_WEIGHT = 30
COMPANY_WEIGHT = 35

app = Flask(__name__)
CORS(app)

sbert_model = SentenceTransformer('paraphrase-MiniLM-L6-v2')

def calculate_similarity_score(user1, user2):
    return cal_hometown_score(user1, user2) + \
            cal_current_city_score(user1, user2) + \
            cal_company_score(user1, user2) + \
            cal_school_score(user1, user2) + \
            cal_mutual_friends_score(user1, user2) 
    '''
            cal_job_score(user1, user2) + \
            cal_hobbies_score(user1, user2) + \
            cal_posts_score(user1, user2) + \
            '''

def cal_hometown_score(user1, user2):
    score = 0
    arr1 = user1["hometown"].split(',')
    arr2 = user2['hometown'].split(',')
    if len(arr1) == 3 and len(arr2) == 3:
        city1, city2 = arr1[0].strip().lower(), arr2[0].strip().lower()
        state1, state2 = arr1[1].strip().lower(), arr2[1].strip().lower()
        country1, country2 = arr1[2].strip().lower(), arr2[2].strip().lower()
        if country1 == country2:
            score += HOMETOWN_SAME_COUNTRY_WEIGHT
            if state1 == state2:
                score += HOMETOWN_SAME_STATE_WEIGHT
                if city1 == city2:
                    score += HOMETOWN_SAME_CITY_WEIGHT
    return score

def cal_current_city_score(user1, user2):
    score = 0
    arr1 = user1["currentCity"].split(',')
    arr2 = user2['currentCity'].split(',')
    if len(arr1) == 3 and len(arr2) == 3:
        city1, city2 = arr1[0].strip().lower(), arr2[0].strip().lower()
        state1, state2 = arr1[1].strip().lower(), arr2[1].strip().lower()
        country1, country2 = arr1[2].strip().lower(), arr2[2].strip().lower()
        if country1 == country2:
            score += CURRENT_SAME_COUNTRY_WEIGHT
            if state1 == state2:
                score += CURRENT_SAME_STATE_WEIGHT
                if city1 == city2:
                    score += CURRENT_SAME_CITY_WEIGHT
    return score

def cal_company_score(user1, user2):
    return util.cos_sim(
        sbert_model.encode(user1["company"]),
        sbert_model.encode(user2["company"])
    ).item() * COMPANY_WEIGHT

def cal_school_score(user1, user2):
    return util.cos_sim(
        sbert_model.encode(user1["school"]),
        sbert_model.encode(user2["school"])
    ).item() * SCHOOL_WEIGHT

def cal_job_score(user1, user2):
    return util.cos_sim(
        sbert_model.encode(user1["job_title"]),
        sbert_model.encode(user2["job_title"])
    ).item() * JOB_WEIGHT

def cal_hobbies_score(user1, user2):
    hobbies1 = ", ".join(user1['hobbies'])
    hobbies2 = ", ".join(user2['hobbies'])
    return util.cos_sim(
        sbert_model.encode(hobbies1),
        sbert_model.encode(hobbies2)
    ).item() * HOBBIES_WEIGHT

def cal_posts_score(user1, user2):
    post1 = ", ".join(user1['posts'])
    post2 = ", ".join(user2['posts'])
    return util.cos_sim(
        sbert_model.encode(post1),
        sbert_model.encode(post2)
    ).item() * POST_WEIGHT

def cal_mutual_friends_score(user1, user2):
    mutual_friends = len(set(user1['friendIds']) & set(user2['friendIds']))
    return mutual_friends * PER_MUTUAL_FRIEND_WEIGHT

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.json
    current_user = data['currentUser']
    non_friends = data['nonFriends']

    recommendations = []
    for user in non_friends:
        score = calculate_similarity_score(current_user, user)
        recommendations.append((user, score))

    # Sort by score and return top 100
    recommendations.sort(key=lambda x: x[1], reverse=True)
    top_recommendations = recommendations[:100]

    return jsonify(top_recommendations)

if __name__ == '__main__':
    app.run(debug=True)