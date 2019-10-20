from dotenv import load_dotenv
import requests
import numpy as np
import os
from base64 import b64encode as b64

load_dotenv()


class agroinfo:
    ''' class to handle awhere and gcp connection '''

    def __init__(self):
        ''' store keys and helpful stuff '''
        self.gcpkey    = os.environ.get('gcpkey')
        self.meteokey  = os.environ.get('meteokey')
        self.gcpurl = 'https://maps.googleapis.com/maps/api/geocode/json?address={}&key={}'
        self.meteourl = 'https://api.meteostat.net/v1{}'

    def fmtgcpurl__(self, addr):
        ''' get a formatted url to geocode given addr '''
        addr = '+'.join(addr.split(' '))
        return self.gcpurl.format(addr, self.gcpkey)

    def geocode(self, addr):
        ''' turn a given addr into (lat,lng) using GCP '''
        url = self.fmtgcpurl__(addr)
        resp = requests.get(url)
        if resp.status_code == 200:
            _ =  resp.json().get('results', [{}])[0].get('geometry', {}).get('location', {})
            return (_.get('lat', ''), _.get('lng', ''))
        return (0, 0)

    def getneareststation(self, addr, n=1):
        ''' get nearest n weather station IDs to addr '''
        lat, lng = self.geocode(addr)
        endpt = f"/stations/nearby?lat={lat}&lon={lng}&limit={n}&key={self.meteokey}"
        req = requests.get(self.meteourl.format(endpt)).json()
        return req.get('data', [{}])[0].get('id', 'X')

    def getweather(self, station):
        ''' get multiannual monthly norms from given station '''
        endpt = f"/climate/normals?station={station}&key={self.meteokey}"
        req = requests.get(self.meteourl.format(endpt)).json()
        return req

if __name__ == '__main__':
    ag = agroinfo()
    print(ag.getweather(ag.getneareststation('319 trenton way menlo park ca')))
