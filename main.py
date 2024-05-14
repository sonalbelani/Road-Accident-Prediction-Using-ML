from flask import Flask, render_template, request
import pandas as pd
import joblib
import numpy as np
# import urllib.request
import urllib.parse

app = Flask(__name__)
model = joblib.load('lr_jlib')

# def sendSMS(apikey, numbers, sender, message):
#         data =  urllib.parse.urlencode({'apikey': apikey, 'numbers': numbers,'message' : message, 'sender': sender})
#         data = data.encode('utf-8')
#         request = urllib.request.Request("https://api.textlocal.in/send/?")
#         f = urllib.request.urlopen(request, data)
#         fr = f.read()
#         return(fr)

def cal(ip):
    input = dict(ip)
    Did_Police_Officer_Attend = input['Did Police Officer Attend Scene of Accident'][0]
    age_of_driver = input['Age_of_Driver'][0]
    vehicle_type = input['Vehicle_Type'][0]
    age_of_vehicle = input['Age_of_Vehicle'][0]
    engine_cc = input['Engine_Capacity_in_CC'][0]
    day = input['Day_of_Week'][0]
    weather = input['Weather_Conditions'][0]
    light = input['Light_Conditions'][0]
    roadsc = input['Road_Surface_Conditions'][0]
    gender = input['Gender'][0]
    speedl = input['Speed_Limit'][0]

    data = np.array([Did_Police_Officer_Attend, age_of_driver, vehicle_type, age_of_vehicle, engine_cc, day, weather, roadsc, light, gender, speedl])

    print("logging",data)
    data = data.astype(float)
    data = data.reshape(1, -1)

    x = np.array([1, 3.73, 3, 0.69, 125, 4, 1, 1, 1, 1, 30]).reshape(1, -1)

    try: result = model.predict(data)
    except Exception as e: result = str(e)

    return str(result[0])


@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/visual/', methods=['GET'])
def visual():
    return render_template('visual.html')

# @app.route('/sms/', methods=['POST'])
# def sms():
#     res=cal(request.form)
#     try:
#         ##resp =  sendSMS('UwYs16dD3zM-DKuzZKQYolAJkoba1j0BmRGompsNRs', 'your phone number', 'TXTLCL', 'Severe acceident')
#         resp =  sendSMS('035887072099aa09c88d72891655d4c5', 'your phone number', 'TXTLCL', 'Severe accident')
#         print (resp)
#     except Exception as e: print(e)    
#     return res

@app.route('/', methods=['POST'])
def get():
    return cal(request.form)

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=4000)