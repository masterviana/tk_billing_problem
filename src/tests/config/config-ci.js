module.exports = {
  'baseUrl': 'http://localhost:8081/v1/billing',
  'account_name': '9999123132130000',
  'calls': [{
    'callId': '00000001',
    'duration': '480',
    'talkdesk_number': '+443983747364',
    'forwarded_phone_number': null,
    'customer_phone_number': '+589484743736',
    'manualCalculationCost': {
      'talkdesk_number_cost': 0.06,
      'forwarded_phone_number': 0.01,
      'profit': 0.05
    }
  }, {
    'callId': '00000002',
    'duration': '147',
    'talkdesk_number': '+443983747364',
    'forwarded_phone_number': '+351933903208',
    'customer_phone_number': '+589484743736',
    'manualCalculationCost': {
      'talkdesk_number_cost': 0.06,
      'forwarded_phone_number': 0.04500,
      'profit': 0.05
    }
  }, {
    'callId': '00000003',
    'duration': '674',
    'talkdesk_number': '+19079283723',
    'forwarded_phone_number': null,
    'customer_phone_number': '+61410938437434',
    'manualCalculationCost': {
      'talkdesk_number_cost': 0.03,
      'forwarded_phone_number': 0.01,
      'profit': 0.05
    }
  }, {
    'callId': '00000004',
    'duration': '231',
    'talkdesk_number': '+19079283723',
    'forwarded_phone_number': '+841639283723',
    'customer_phone_number': '912387234',
    'manualCalculationCost': {
      'talkdesk_number_cost': 0.03,
      'forwarded_phone_number': 0.11500,
      'profit': 0.05
    }
  }, {
    'callId': '00000005',
    'duration': '732',
    'talkdesk_number': '+886920834763',
    'forwarded_phone_number': null,
    'customer_phone_number': '8736434343',
    'manualCalculationCost': {
      'talkdesk_number_cost': 0.01,
      'forwarded_phone_number': 0.01,
      'profit': 0.05
    }
  },
    {
      'callId': '00000006',
      'duration': '732',
      'talkdesk_number': '+886920834763',
      'forwarded_phone_number': '+18684693834',
      'customer_phone_number': '8736434343',
      'manualCalculationCost': {
        'talkdesk_number_cost': 0.01,
        'forwarded_phone_number': 0.24500,
        'profit': 0.05
      }
    }

  ]

};
