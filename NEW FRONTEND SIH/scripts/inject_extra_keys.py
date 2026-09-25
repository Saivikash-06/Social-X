# -*- coding: utf-8 -*-
import json

EXTRA_UI_KEYS = {
    'en': {
        'ai.title': 'AI Governance Engine',
        'create_user': 'Provision User',
        'users': 'User Management',
        'full_name': 'Full Name',
        'PDF': 'PDF Document',
        'Excel': 'Excel Spreadsheet',
        'English': 'English',
        'accepted': 'Accepted',
        'none': 'None',
        'system': 'System Telemetry',
        'modifications_requested': 'Modifications Requested'
    },
    'hi': {
        'ai.title': 'एआई गवर्नेंस इंजन',
        'create_user': 'उपयोगकर्ता बनाएं',
        'users': 'उपयोगकर्ता प्रबंधन',
        'full_name': 'पूरा नाम',
        'PDF': 'पीडीएफ दस्तावेज',
        'Excel': 'एक्सेल स्प्रेडशीट',
        'English': 'अंग्रेजी',
        'accepted': 'स्वीकृत',
        'none': 'कोई नहीं',
        'system': 'सिस्टम टेलीमेट्री',
        'modifications_requested': 'संशोधन का अनुरोध किया गया'
    },
    'ta': {
        'ai.title': 'AI நிர்வாக இயந்திரம்',
        'create_user': 'பயனரை உருவாக்கவும்',
        'users': 'பயனர் மேலாண்மை',
        'full_name': 'முழு பெயர்',
        'PDF': 'PDF ஆவணம்',
        'Excel': 'Excel விரிதாள்',
        'English': 'ஆங்கிலம்',
        'accepted': 'ஏற்றுக்கொள்ளப்பட்டது',
        'none': 'எதுவுமில்லை',
        'system': 'கணினி தொலைநிலை அளவீடு',
        'modifications_requested': 'மாற்றங்கள் கோரப்பட்டன'
    },
    'te': {
        'ai.title': 'AI గవర్నెన్స్ ఇంజిన్',
        'create_user': 'వినియోగదారుని సృష్టించండి',
        'users': 'వినియోగదారు నిర్వహణ',
        'full_name': 'పూర్తి పేరు',
        'PDF': 'PDF పత్రం',
        'Excel': 'Excel స్ಪ್ರెడ్‌షీట్',
        'English': 'ఆంగ్లం',
        'accepted': 'ఆమోదించబడింది',
        'none': 'ఏదీ లేదు',
        'system': 'సిస్టమ్ టెలిమెట్రీ',
        'modifications_requested': 'మార్పులు అభ్యర్థించబడ్డాయి'
    },
    'kn': {
        'ai.title': 'AI ಆಡಳಿತ ಎಂಜಿನ್',
        'create_user': 'ಬಳಕೆದಾರರನ್ನು ರಚಿಸಿ',
        'users': 'ಬಳಕೆದಾರ ನಿರ್ವಹಣೆ',
        'full_name': 'ಪೂರ್ಣ ಹೆಸರು',
        'PDF': 'PDF ದಾಖಲೆ',
        'Excel': 'Excel ಸ್ಪ್ರೆಡ್‌ಶೀಟ್',
        'English': 'ಇಂಗ್ಲಿಷ್',
        'accepted': 'ಸ್ವೀಕರಿಸಲಾಗಿದೆ',
        'none': 'ಯಾವುದೂ ಇಲ್ಲ',
        'system': 'ಸಿಸ್ಟಮ್ ಟೆಲಿಮೆಟ್ರಿ',
        'modifications_requested': 'ಬದಲಾವಣೆಗಳನ್ನು ಕೋರಲಾಗಿದೆ'
    },
    'ml': {
        'ai.title': 'AI ഭരണ എഞ്ചിൻ',
        'create_user': 'ഉപയോക്താവിനെ സൃഷ്ടിക്കുക',
        'users': 'ഉപയോക്തൃ മാനേജ്മെന്റ്',
        'full_name': 'പൂർണ്ണ നാമം',
        'PDF': 'PDF രേഖ',
        'Excel': 'Excel സ്പ്രെഡ്ഷീറ്റ്',
        'English': 'ഇംഗ്ലീഷ്',
        'accepted': 'സ്വീകരിച്ചു',
        'none': 'ഒന്നുമില്ല',
        'system': 'സിസ്റ്റം ടെലിമെട്രി',
        'modifications_requested': 'മാറ്റങ്ങൾ ആവശ്യപ്പെട്ടു'
    },
    'mr': {
        'ai.title': 'एआय प्रशासन इंजिन',
        'create_user': 'वापरकर्ता तयार करा',
        'users': 'वापरकर्ता व्यवस्थापन',
        'full_name': 'पूर्ण नाव',
        'PDF': 'PDF दस्तऐवज',
        'Excel': 'Excel स्प्रेडशीट',
        'English': 'इंग्रजी',
        'accepted': 'स्वीकारले',
        'none': 'काहीही नाही',
        'system': 'सिस्टम टेलिमेट्री',
        'modifications_requested': 'बदलांची विनंती केली'
    },
    'bn': {
        'ai.title': 'এআই শাসন ইঞ্জিন',
        'create_user': 'ব্যবহারকারী তৈরি করুন',
        'users': 'ব্যবহারকারী ব্যবস্থাপনা',
        'full_name': 'সম্পূর্ণ নাম',
        'PDF': 'PDF নথি',
        'Excel': 'Excel স্প্রেডশীট',
        'English': 'ইংরেজি',
        'accepted': 'গৃহীত',
        'none': 'কিছুই না',
        'system': 'সিস্টেম টেলিমেট্রি',
        'modifications_requested': 'সংশোধন অনুরোধ করা হয়েছে'
    },
    'or': {
        'ai.title': 'AI ଶାସନ ଇଞ୍ଜିନ୍',
        'create_user': 'ବ୍ୟବହାରକାରୀ ସୃଷ୍ଟି କରନ୍ତୁ',
        'users': 'ବ୍ୟବହାରକାରୀ ପରିଚାଳନା',
        'full_name': 'ପୂର୍ଣ୍ଣ ନାମ',
        'PDF': 'PDF ଦଲିଲ',
        'Excel': 'Excel ସ୍ପ୍ରେଡସିଟ୍',
        'English': 'ଇଂରାଜୀ',
        'accepted': 'ଗ୍ରହଣ କରାଯାଇଛି',
        'none': 'କିଛି ନାହିଁ',
        'system': 'ସିଷ୍ଟମ୍ ଟେଲିମେଟ୍ରି',
        'modifications_requested': 'ପରିବର୍ତ୍ତନ ଅନୁରୋଧ କରାଯାଇଛି'
    }
}

for lang, kv in EXTRA_UI_KEYS.items():
    for fpath in [f'src/locales/{lang}.json', f'src/locales/{lang}/common.json']:
        with open(fpath, 'r', encoding='utf-8') as f:
            d = json.load(f)
        for k, v in kv.items():
            parts = k.split('.')
            cur = d
            for p in parts[:-1]:
                if p not in cur or not isinstance(cur[p], dict):
                    cur[p] = {}
                cur = cur[p]
            cur[parts[-1]] = v
            d[k] = v
        with open(fpath, 'w', encoding='utf-8') as f:
            json.dump(d, f, indent=2, ensure_ascii=False)
    print(f"Injected extra UI keys into {lang}")
