from dotenv import load_dotenv
import requests
import numpy as np
import os
from base64 import b64encode as b64

load_dotenv()


# why am i doing this???
class fakedata:

    def __init__(self):
        ''' set up a dict for records for each month '''
        self.mos = [
            'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL',
            'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
        ]
        self.metrics = [{k: -1 for k in ['temperature',
            'precipitation', 'sunshine', 'pressure']}]
        self.temperature()
        self.precipitation()
        self.sunshine()
        self.pressure()

    def gen__(self, low, high, sort=False):
        _ =  list(map(lambda x: round(x, 2), np.random.uniform(low=low, high=high, size=12)))
        if sort:
            _ = sorted(_)
        return list(np.array(_).astype(str))

    def temperature(self):
        fd = self.gen__(0, 20)
        self.metrics['temperature'] = {self.mos[i]:fd[i] for i, _ in enumerate(fd)}

    def precipitation(self):
        fd = self.gen__(20, 70, 'precipitation')
        self.metrics['precipitation'] = {self.mos[i]:fd[i] for i, _ in enumerate(fd)}

    def sunshine(self):
        fd = self.gen__(40, 250, 'sunshine')
        self.metrics['sunshine'] = {self.mos[i]:fd[i] for i, _ in enumerate(fd)}

    def pressure(self):
        fd = self.gen__(1000, 1020, 'pressure')
        self.metrics['pressure'] = {self.mos[i]:fd[i] for i, _ in enumerate(fd)}


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
        if len(req.get('data', [])) < 1:
            return '10637'
        return req.get('data', [{}])[0].get('id', 'X')

    def getweather(self, station):
        ''' get multiannual monthly norms from given station '''
        endpt = f"/climate/normals?station={station}&key={self.meteokey}"
        req = requests.get(self.meteourl.format(endpt)).json()
        if len(req.get('data', [])) < 1:
            return fakedata().metrics
        else:
            return req['data']
