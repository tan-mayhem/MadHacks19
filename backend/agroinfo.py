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
        self.gcpurl = 'https://maps.googleapis.com/maps/api/geocode/json?address={}&key={}'
        self.awhereurl = 'https://api.awhere.com{}'
        self.makeawherekey__()

    def makeawherekey__(self):
        ''' combine our awhere access and key to get api key '''
        url = self.awhereurl.format('/oauth/token')
        _ = f"{os.environ.get('awhereaccess')}:{os.environ.get('awheresecret')}"
        _ = b64(_.encode('utf-8')).decode('utf-8')
        data = {'grant_type': 'client_credentials'}
        headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': f'Basic {_}'
        }
        _ = requests.post(url, data=data, headers=headers).json()
        self.awherekey = _['access_token']

    def initfield(self, field_id, field_addr):
        ''' get awhere field ID for this field '''
        lat, lng = self.geocode(field_addr)
        body = {
            'id': field_id,
            'centerPoint':
                {'latititude': lat,
                 'longitude':  lng}
        }
        headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': f'Basic {_}'
        }

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
