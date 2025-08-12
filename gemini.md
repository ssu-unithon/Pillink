<aside>
✅

## 서버 관련 정보

- API Domain : https://pillink-backend-production.up.railway.app/
</aside>

<aside>
🔒

## Auth

- [ GET ] Google 로그인 `/auth/google`


- [ GET ] Google 리다이렉션 `/auth/google/redirect`
- [ POST ] 로그인 `/auth/login`

  Request

    ```json
    {
      "email" : "korean1790@gmail.com",
      "password" : "1234"
    }
    ```

  Response

    - 받은 accessToken은 요청할때 마다 Header > Bearer Token에 넣어주세요

    ```json
    {
    	accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJrb3JlYW4xNzkwQGdtYWlsLmNvbSIsIm5hbWUiOiLsnbTsnqztl4wiLCJyb2xlIjoidXNlciIsImlhdCI6MTc1MTc5NjE2NiwiZXhwIjoxNzUxODEwNTY2fQ.8__MrfJ0oq20P2JU7YA2FhLMRdLVEE6NDtuudQA6i-8"
    }
    ```

- [ POST ]  회원가입 `/auth/register`

  Request

    ```json
    {
      "phone" : "test2",
      "name" : "테스터2",
      "password" : "1234",
      "provider" : "local",
      "role": "보호자"
      "diseases" : ["당뇨병", "고혈압"]
    }
    ```

  Response

    ```json
    {
        "phone": "test2",
        "name": "테스터2",
        "password": "$2b$10$oxdcTfs4q0u6uOJkEf9GsOanO5.t9pXPPnSMOYN5hfpTdSkK16rq.",
        "provider": "local",
        "diseases": [
            "당뇨병",
            "고혈압"
        ],
        "id": 3,
        "role": "보호자"
    }
    ```

- [ DELETE ] 회원탈퇴 `/auth/me`

    ```json
    {
        "raw": [],
        "affected": 1
    }
    ```

</aside>

<aside>
💊

## Pill

- [ GET ] 약품 검색 `/pill/search`  ✅
    - `http://127.0.0.1:3000/pill/search?itemName=`

    ```json
    {
        "pageNo": 1,
        "totalCount": 7,
        "numOfRows": 10,
        "items": [
            {
                "entpName": "한국존슨앤드존슨판매(유)",
                "itemName": "어린이타이레놀산160밀리그램(아세트아미노펜)",
                **"itemSeq": "202005623"**,
                "efcyQesitm": "이 약은 감기로 인한 발열 및 동통(통증), 두통, 신경통, 근육통, 월경통, 염좌통(삔 통증), 치통, 관절통, 류마티양 동통(통증)에 사용합니다.\n",
                "useMethodQesitm": "만 7~12세 소아는 1회 권장용량을 4~6시간마다 필요시 물 없이 혀에 직접 복용합니다.\n\n이 약은 가능한 최단기간동안 최소 유효용량으로 복용하며, 1일 5회(75 mg/kg)를 초과하여 복용하지 않습니다.\n\n몸무게를 아는 경우 몸무게에 따른 용량(10~15 mg/kg)으로 복용하는 것이 더 적절합니다.\n\n연령대별 용량은 허가사항을 참고하십시오.\n",
                "atpnWarnQesitm": "매일 세잔 이상 정기적 음주자가 이 약 또는 다른 해열진통제를 복용할 때는 의사 또는 약사와 상의하십시오. 간손상을 일으킬 수 있습니다.\n\n매우 드물게 치명적일 수 있는 급성전신발진고름물집증, 스티븐스-존슨증후군, 독성표피괴사용해와 같은 중대한 피부반응이 보고되었고 이 약 복용 후 피부발진 또는 다른 과민반응의 징후가 나타나는 경우 즉시 복용을 중단하십시오.\n\n아세트아미노펜으로 일일 최대 용량(4,000 mg)을 초과하여 복용하지 마십시오. 간손상을 일으킬 수 있습니다. 아세트아미노펜을 포함하는 다른 제품과 함께 복용하지 마십시오.\n",
                "atpnQesitm": "이 약에 과민증 환자, 소화성궤양, 심한 혈액 이상, 심한 간장애, 심한 신장(콩팥)장애, 심한 심장기능저하 환자, 아스피린 천식(비스테로이드성 소염(항염)제에 의한 천식발작 유발) 또는 경험자는 이 약을 복용하지 마십시오.\n\n이 약을 복용하기 전에 간장애 또는 경험자, 신장(콩팥)장애 또는 경험자, 소화성궤양 경험자, 혈액이상 또는 경험자, 출혈경향, 심장기능이상, 과민증 경험자, 기관지 천식 환자, 고령자(노인), 만 2세 미만 소아, 임부 또는 수유부, 글루타치온 보유량이 낮은 상태 환자는 의사 또는 약사와 상의하십시오.\n\n의사 또는 약사의 지시없이 통증에 10일 이상(성인)또는 5일 이상(소아) 복용하지 않고 발열에 3일 이상 복용하지 마십시오.\n",
                "intrcQesitm": "바르비탈계 약물, 삼환계 항우울제, 알코올, 다른 소염(항염)진통제와 함께 복용하지 마십시오.\n\n와파린, 플루클록사실린과 함께 복용 시 의사 또는 약사와 상의하십시오.\n",
                "seQesitm": "쇽 증상(호흡곤란, 온몸이 붉어짐, 혈관부기, 두드러기 등), 천식발작, 혈소판 감소, 과립구감소, 용혈성(적혈구파괴성)빈혈, 메트헤모글로빈혈증, 혈소판기능 저하(출혈시간 연장), 청색증, 과민증상(얼굴부기, 호흡곤란, 땀이 남, 저혈압, 쇽), 구역, 구토, 식욕부진, 장기복용 시 위장출혈, 소화성궤양, 천공(뚫림) 등의 위장관계 이상, 발진, 알레르기 반응, 피부점막안증후군(스티븐스-존슨증후군), 독성표피괴사용해(리엘증후군), AST 상승, ALT 상승, 고정발진 등, 통증이나 발열 증상이 지속되거나 악화될 경우 또는 새로운 증상이 나타나는 경우 복용을 즉각 중지하고 의사 또는 약사와 상의하십시오.\n",
                "depositMethodQesitm": "실온에서 보관하십시오.\n\n어린이의 손이 닿지 않는 곳에 보관하십시오.\n",
                "openDe": "2024-12-31 00:00:00",
                "updateDe": "2024-12-20",
                "itemImage": null,
                "bizrno": "1068649891"
            },
            {
                "entpName": "한국존슨앤드존슨판매(유)",
                "itemName": "타이레놀정500밀리그람(아세트아미노펜)",
                "itemSeq": "202106092",
                "efcyQesitm": "이 약은 감기로 인한 발열 및 동통(통증), 두통, 신경통, 근육통, 월경통, 염좌통(삔 통증), 치통, 관절통, 류마티양 동통(통증)에 사용합니다\n",
                "useMethodQesitm": "만 12세 이상 소아 및 성인은 1회 1~2정씩, 1일 3~4회(4~6시간 마다) 필요시 복용합니다.\n\n이 약은 가능한 최단기간동안 최소 유효용량으로 복용하며, 1일 최대 8정(4 g)을 초과하여 복용하지 않습니다.\n",
                "atpnWarnQesitm": "매일 세 잔 이상 정기적 음주자가 이 약 또는 다른 해열진통제를 복용할  때는 의사 또는 약사와 상의하십시오. 간손상을 일으킬 수 있습니다.\n\n매우 드물게 치명적일 수 있는 급성 전신성 발진성 고름물집증, 스티븐스-존슨 증후군, 독성 표피 괴사용해와 같은 중대한 피부반응이 보고되었고 이 약 복용후 피부발진 또는 다른 과민반응의 징후가 나타나는 경우 즉시 복용을 중단하십시오.\n\n아세트아미노펜으로 일일 최대 용량(4,000 mg)을 초과하여 복용하지 마십시오. 간손상을 일으킬 수 있습니다. 아세트아미노펜을 포함하는 다른 제품과 함께 복용하지 마십시오.\n",
                "atpnQesitm": "이 약에 과민증, 소화성궤양, 심한 혈액 이상, 간장애, 신장(콩팥)장애, 심장기능저하 환자, 아스피린 천식(비스테로이드성 소염(항염)제에 의한 천식발작 유발) 환자 또는 경험자, 바르비탈계 약물 또는 삼환계 항우울제 복용한 환자, 알코올을 복용한 사람, 12세 미만의 소아는 이 약을 복용하지 마십시오.\n\n이 약을 복용하기 전에 과민증 경험자, 간장애, 신장(콩팥)장애, 소화성궤양, 혈액이상 환자 또는 경험자, 출혈경향, 심장기능이상이 있는 환자, 기관지천식 환자, 고령자(노인), 임부 또는 수유부, 글루타치온 보유량이 낮은 상태의 환자는 의사 또는 약사와 상의하십시오.\n\n복용 중에 음주하지 마십시오.\n",
                "intrcQesitm": "바르비탈계 약물, 삼환계 항우울제 및 알코올을 투여한 환자, 와파린, 플루클록사실린을 복용하는 환자는 의사 또는 약사와 상의하십시오.\n",
                "seQesitm": "쇽 증상(호흡곤란, 온몸이 붉어짐, 혈관부기, 두드러기 등), 천식발작, 혈소판감소, 과립구감소, 용혈성빈혈, 메트헤모글로빈혈증, 혈소판기능 저하(출혈시간 연장), 청색증, 과민증상(얼굴부기, 땀이 남, 저혈압), 구역, 구토, 식욕부진, 위장출혈, 소화성궤양, 천공(뚦림), 발진, 알레르기 반응, 피부점막안증후군(스티븐스-존슨증후군), 독성표피괴사증(리엘증후군), AST 상승, ALT 상승, 고정발진 등이 나타나는 경우 복용을 즉각 중지하고 의사 또는 약사와 상의하십시오.\n",
                "depositMethodQesitm": "실온에서 보관하십시오.\n\n어린이의 손이 닿지 않는 곳에 보관하십시오.\n",
                "openDe": "2023-05-31 00:00:00",
                "updateDe": "2024-11-25",
                "itemImage": "https://nedrug.mfds.go.kr/pbp/cmn/itemImageDownload/1OKRXo9l4D5",
                "bizrno": "1068649891"
            },
            ...
    		]
    }
    ```

- [ GET ] 약품 상세 정보 조회 `/pill/item/:itemSeq` ✅
    - `http://127.0.0.1:3000/pill/item/202005623`

    ```json
    {
        "entpName": "한국존슨앤드존슨판매(유)",
        "itemName": "어린이타이레놀산160밀리그램(아세트아미노펜)",
        "itemSeq": "202005623",
        "efcyQesitm": "이 약은 감기로 인한 발열 및 동통(통증), 두통, 신경통, 근육통, 월경통, 염좌통(삔 통증), 치통, 관절통, 류마티양 동통(통증)에 사용합니다.\n",
        "useMethodQesitm": "만 7~12세 소아는 1회 권장용량을 4~6시간마다 필요시 물 없이 혀에 직접 복용합니다.\n\n이 약은 가능한 최단기간동안 최소 유효용량으로 복용하며, 1일 5회(75 mg/kg)를 초과하여 복용하지 않습니다.\n\n몸무게를 아는 경우 몸무게에 따른 용량(10~15 mg/kg)으로 복용하는 것이 더 적절합니다.\n\n연령대별 용량은 허가사항을 참고하십시오.\n",
        "atpnWarnQesitm": "매일 세잔 이상 정기적 음주자가 이 약 또는 다른 해열진통제를 복용할 때는 의사 또는 약사와 상의하십시오. 간손상을 일으킬 수 있습니다.\n\n매우 드물게 치명적일 수 있는 급성전신발진고름물집증, 스티븐스-존슨증후군, 독성표피괴사용해와 같은 중대한 피부반응이 보고되었고 이 약 복용 후 피부발진 또는 다른 과민반응의 징후가 나타나는 경우 즉시 복용을 중단하십시오.\n\n아세트아미노펜으로 일일 최대 용량(4,000 mg)을 초과하여 복용하지 마십시오. 간손상을 일으킬 수 있습니다. 아세트아미노펜을 포함하는 다른 제품과 함께 복용하지 마십시오.\n",
        "atpnQesitm": "이 약에 과민증 환자, 소화성궤양, 심한 혈액 이상, 심한 간장애, 심한 신장(콩팥)장애, 심한 심장기능저하 환자, 아스피린 천식(비스테로이드성 소염(항염)제에 의한 천식발작 유발) 또는 경험자는 이 약을 복용하지 마십시오.\n\n이 약을 복용하기 전에 간장애 또는 경험자, 신장(콩팥)장애 또는 경험자, 소화성궤양 경험자, 혈액이상 또는 경험자, 출혈경향, 심장기능이상, 과민증 경험자, 기관지 천식 환자, 고령자(노인), 만 2세 미만 소아, 임부 또는 수유부, 글루타치온 보유량이 낮은 상태 환자는 의사 또는 약사와 상의하십시오.\n\n의사 또는 약사의 지시없이 통증에 10일 이상(성인)또는 5일 이상(소아) 복용하지 않고 발열에 3일 이상 복용하지 마십시오.\n",
        "intrcQesitm": "바르비탈계 약물, 삼환계 항우울제, 알코올, 다른 소염(항염)진통제와 함께 복용하지 마십시오.\n\n와파린, 플루클록사실린과 함께 복용 시 의사 또는 약사와 상의하십시오.\n",
        "seQesitm": "쇽 증상(호흡곤란, 온몸이 붉어짐, 혈관부기, 두드러기 등), 천식발작, 혈소판 감소, 과립구감소, 용혈성(적혈구파괴성)빈혈, 메트헤모글로빈혈증, 혈소판기능 저하(출혈시간 연장), 청색증, 과민증상(얼굴부기, 호흡곤란, 땀이 남, 저혈압, 쇽), 구역, 구토, 식욕부진, 장기복용 시 위장출혈, 소화성궤양, 천공(뚫림) 등의 위장관계 이상, 발진, 알레르기 반응, 피부점막안증후군(스티븐스-존슨증후군), 독성표피괴사용해(리엘증후군), AST 상승, ALT 상승, 고정발진 등, 통증이나 발열 증상이 지속되거나 악화될 경우 또는 새로운 증상이 나타나는 경우 복용을 즉각 중지하고 의사 또는 약사와 상의하십시오.\n",
        "depositMethodQesitm": "실온에서 보관하십시오.\n\n어린이의 손이 닿지 않는 곳에 보관하십시오.\n",
        "openDe": "2024-12-31 00:00:00",
        "updateDe": "2024-12-20",
        "itemImage": null,
        "bizrno": "1068649891"
    }
    ```

- [ GET ] 자신 또는 그룹의 약품 조회 `/pill` ✅
    - `/pill` : 쿼리가 없다면 → 자신의 복용약 목록 조회
    - `/pill?targetId=1` : 쿼리가 있다면 → 해당 사용자의 복용약 목록 조회

    ```json
    [
        {
            "id": 2,
            "itemSeq": "202005623",
            "name": "어린이타이레놀산160밀리그램(아세트아미노펜)",
            "is_pined": false,
            "count": 3
        },
        {
            "id": 3,
            "itemSeq": "202106092",
            "name": "타이레놀정500밀리그람(아세트아미노펜)",
            "is_pined": false,
            "count": 3
        }
    ]
    ```

- [ POST ] 그룹 인원에게 약 추가 `/pill` ✅

  Request

    ```json
    { 
        "targetId": 2,
        "itemSeq": "202106092" ,
        "count": 3
    }
    ```

  Response

    ```json
    {
        "user": {
            "id": 2
        },
        "name": "타이레놀정500밀리그람(아세트아미노펜)",
        "itemSeq": "202106092",
        "id": 3,
        "count": 3
        "is_pined": false
    }
    ```

</aside>

<aside>
👨‍👦

## Family

- [ GET ] 그룹 조회 `/famliy` ✅

    ```json
    {
        "id": 2,
        "name": "게스트의 가족",
        "users": [
            {
                "id": 1,
                "name": "게스트",
                "phone": "guest",
                "password": "$2b$10$zc.U8yPXN9QjzMN4pIlUt.SXRE9GE8GfEd8/36iZUUEpF2qJ/hMXy",
                "provider": "local",
                "role": "user"
            }
        ],
        "manager": {
            "id": 1,
            "name": "게스트",
            "phone": "guest",
            "password": "$2b$10$zc.U8yPXN9QjzMN4pIlUt.SXRE9GE8GfEd8/36iZUUEpF2qJ/hMXy",
            "provider": "local",
            "role": "user"
        }
    }
    ```

- [ GET ] 그룹 초대 `/famliy/invite`
    - `/famliy/invite?targetPhone=guest`

    ```json
    {
        "id": 2,
        "name": "게스트의 가족",
        "users": [
            {
                "id": 1,
                "name": "게스트",
                "phone": "guest",
                "password": "$2b$10$zc.U8yPXN9QjzMN4pIlUt.SXRE9GE8GfEd8/36iZUUEpF2qJ/hMXy",
                "provider": "local",
                "role": "user"
            },
            {
                "id": 2,
                "name": "테스터",
                "phone": "test",
                "password": "$2b$10$VPsXbHrsMG9goiwy.4smO.K4mvefeFE6o123C5Ao3hjYKSxGCoTPW",
                "provider": "local",
                "role": "user",
                "family": null,
                "owned_pills": []
            }
        ],
        "manager": {
            "id": 1,
            "name": "게스트",
            "phone": "guest",
            "password": "$2b$10$zc.U8yPXN9QjzMN4pIlUt.SXRE9GE8GfEd8/36iZUUEpF2qJ/hMXy",
            "provider": "local",
            "role": "user"
        }
    }
    ```

- [ GET ] 그룹 탈퇴 `/famliy/leave`
- [ POST ] 그룹 생성 `/famliy`

    ```json
    {
        "name": "게스트의 가족",
        "manager": {
            "id": 1,
            "name": "게스트",
            "phone": "guest",
            "password": "$2b$10$zc.U8yPXN9QjzMN4pIlUt.SXRE9GE8GfEd8/36iZUUEpF2qJ/hMXy",
            "provider": "local",
            "role": "user",
            "family": null
        },
        "users": [
            {
                "id": 1,
                "name": "게스트",
                "phone": "guest",
                "password": "$2b$10$zc.U8yPXN9QjzMN4pIlUt.SXRE9GE8GfEd8/36iZUUEpF2qJ/hMXy",
                "provider": "local",
                "role": "user",
                "family": null
            }
        ],
        "id": 2
    }
    ```

</aside>

<aside>
⏰

## Alarm

- [ GET ] 알림 조회 `/alarm`
    - `/alarm?targetId=1`
    - 시간 순 **정렬**
    - targetId가 있다면, 해당 유저의 알림 조회
    - targetId가 없다면, 현재 유저의 알림 조회

    ```json
    [
        {
            "id": 2,
            "name": "",
            "hour": 13,
            "minute": 46,
            "is_enabled": true,
            "itemSeq": "",
            "image_url": "",
            "detail": null
        },
        {
            "id": 11,
            "name": "메토트렉세이트",
            "hour": 18,
            "minute": 1,
            "is_enabled": true,
            "itemSeq": "1234",
            "image_url": "1234",
            "detail": null
        },
        {
            "id": 9,
            "name": "아스피린",
            "hour": 18,
            "minute": 71,
            "is_enabled": true,
            "itemSeq": "199001012",
            "image_url": "1234",
            "detail": {
                "entpName": "(주)보령",
                "itemName": "보령아스트릭스캡슐100밀리그람(아스피린)",
                "itemSeq": "199001012",
                "efcyQesitm": "이 약은 심근경색, 뇌경색, 불안정형 협심증에서 혈전 생성 억제와 관상동맥 우회술(CABG) 또는 경피경관 관상동맥 성형술(PTCA) 후 혈전 생성 억제와 고위험군환자(허혈성 심장질환의 가족력, 고혈압, 고콜레스테롤혈증, 비만, 당뇨 등 복합적 위험인자를 가진 환자)에서 심혈관계 위험성 감소에 사용합니다.\n",
                "useMethodQesitm": "성인은 1회 1캡슐, 1일 1회 복용합니다.\n\n이 약은 장용캡슐이므로 충분한 물과 함께 식전에 복용할 수 있습니다.\n",
                "atpnWarnQesitm": null,
                "atpnQesitm": "이 약 또는 다른 살리실산제제에 과민증 환자, 소화성궤양, 아스피린천식(비스테로이드성 소염진통제 등에 의한 천식발작의 유발) 또는 경험 환자, 혈우병, 심한 간장애, 심한 신장애, 심기능부전, 출혈경향, 일주일 동안 메토트렉세이트 15밀리그람(15 mg/주) 이상의 용량을 병용 투여하는 환자, 임신 3기에 해당하는 임부는 이 약을 복용하지 마십시오.\n\n이 약을 복용하기 전에 신장애, 심혈관 순환기능이상, 간장애, 심기능이상, 혈액이상, 기관지천식, 수술전의 환자, 3세 이하의 유아, 진통제, 소염제, 항류마티스제에 대한 과민증 및 다른 알레르기 질환 경험 환자, 고령자(노인), 포도당-6-인산염 탈수소효소결핍 환자, 황색5호에 과민증 환자는 의사 또는 약사와 상담하십시오.\n\n이 약의 장용피막을 파손하지 않도록 유의하십시오.\n\n수술(치과수술 포함)을 하는 경우에는 담당의사에게 아스피린 제제를 복용하고 있음을 알리고 상담을 받아야 합니다.\n",
                "intrcQesitm": "다른 비스테로이드성 소염진통제 및 살리실산 제제, 고용량 메토트렉세이트와 함께 사용하지 마십시오.\n\n항응고제, 혈전용해제/다른 혈소판응집억제제, 지혈제, 당뇨병치료제(인슐린제제, 톨부타미드 등), 요산배설촉진제(벤즈브로마론, 프로베네시드), 리튬제제, 선택적 세포토닌 재흡수 억제제, 디곡신, 전신 작용 부신피질호르몬 제제(애디슨병 대체요법용 히드로코티손 제외), 안지오텐신 전환 효소 억제제, 발프로산, 알칼리제제(예: 탄산수소나트륨, 탄산마그네슘)와 함께 복용 시 의사 또는 약사와 상의하십시오.\n\n알코올과 병용 투여 시 위장관 점막 손상이 증가하고 출혈시간이 연장될 수 있습니다.\n",
                "seQesitm": "쇽 증상(예: 호흡곤란, 전신조홍, 혈관부종, 두드러기), 천식발작, 홍반, 간지러움, 코막힘, 심장-호흡기 장애, 때때로 발진, 부종, 두드러기, 비염증상, 결막염, 드물게 독성표피괴사용해(리엘증후군), 피부점막안증후군(스티븐스-존슨증후군), 박탈성피부염, 드물게 재생불량성빈혈, 빈혈, 백혈구감소, 혈소판감소, 혈소판기능 저하(출혈시간의 지연), 귀에서 소리가 남, 귀 먹음, 어지러움, 두통, 흥분, 드물게 간장애, 매우 드물게 간 트랜스아미나제 상승에 따른 일시적인 간손상, 신장애, 급성신부전, 과호흡, 대사성산증, 과도한 체온강하, 허탈, 사지냉각 등이 나타나는 경우 복용을 즉각 중지하고 의사 또는 약사와 상담하십시오.\n\n식욕부진, 가슴쓰림, 위통, 구역, 구토 등이 나타날 수 있습니다.\n",
                "depositMethodQesitm": "실온에서 보관하십시오.\n\n어린이의 손이 닿지 않는 곳에 보관하십시오.\n",
                "openDe": "2021-10-01 00:00:00",
                "updateDe": "2022-08-19",
                "itemImage": "https://nedrug.mfds.go.kr/pbp/cmn/itemImageDownload/154599017940000101",
                "bizrno": "2088100281"
            }
        },
        {
            "id": 10,
            "name": "아스피린",
            "hour": 18,
            "minute": 72,
            "is_enabled": true,
            "itemSeq": "199001012",
            "image_url": "1234",
            "detail": {
                "entpName": "(주)보령",
                "itemName": "보령아스트릭스캡슐100밀리그람(아스피린)",
                "itemSeq": "199001012",
                "efcyQesitm": "이 약은 심근경색, 뇌경색, 불안정형 협심증에서 혈전 생성 억제와 관상동맥 우회술(CABG) 또는 경피경관 관상동맥 성형술(PTCA) 후 혈전 생성 억제와 고위험군환자(허혈성 심장질환의 가족력, 고혈압, 고콜레스테롤혈증, 비만, 당뇨 등 복합적 위험인자를 가진 환자)에서 심혈관계 위험성 감소에 사용합니다.\n",
                "useMethodQesitm": "성인은 1회 1캡슐, 1일 1회 복용합니다.\n\n이 약은 장용캡슐이므로 충분한 물과 함께 식전에 복용할 수 있습니다.\n",
                "atpnWarnQesitm": null,
                "atpnQesitm": "이 약 또는 다른 살리실산제제에 과민증 환자, 소화성궤양, 아스피린천식(비스테로이드성 소염진통제 등에 의한 천식발작의 유발) 또는 경험 환자, 혈우병, 심한 간장애, 심한 신장애, 심기능부전, 출혈경향, 일주일 동안 메토트렉세이트 15밀리그람(15 mg/주) 이상의 용량을 병용 투여하는 환자, 임신 3기에 해당하는 임부는 이 약을 복용하지 마십시오.\n\n이 약을 복용하기 전에 신장애, 심혈관 순환기능이상, 간장애, 심기능이상, 혈액이상, 기관지천식, 수술전의 환자, 3세 이하의 유아, 진통제, 소염제, 항류마티스제에 대한 과민증 및 다른 알레르기 질환 경험 환자, 고령자(노인), 포도당-6-인산염 탈수소효소결핍 환자, 황색5호에 과민증 환자는 의사 또는 약사와 상담하십시오.\n\n이 약의 장용피막을 파손하지 않도록 유의하십시오.\n\n수술(치과수술 포함)을 하는 경우에는 담당의사에게 아스피린 제제를 복용하고 있음을 알리고 상담을 받아야 합니다.\n",
                "intrcQesitm": "다른 비스테로이드성 소염진통제 및 살리실산 제제, 고용량 메토트렉세이트와 함께 사용하지 마십시오.\n\n항응고제, 혈전용해제/다른 혈소판응집억제제, 지혈제, 당뇨병치료제(인슐린제제, 톨부타미드 등), 요산배설촉진제(벤즈브로마론, 프로베네시드), 리튬제제, 선택적 세포토닌 재흡수 억제제, 디곡신, 전신 작용 부신피질호르몬 제제(애디슨병 대체요법용 히드로코티손 제외), 안지오텐신 전환 효소 억제제, 발프로산, 알칼리제제(예: 탄산수소나트륨, 탄산마그네슘)와 함께 복용 시 의사 또는 약사와 상의하십시오.\n\n알코올과 병용 투여 시 위장관 점막 손상이 증가하고 출혈시간이 연장될 수 있습니다.\n",
                "seQesitm": "쇽 증상(예: 호흡곤란, 전신조홍, 혈관부종, 두드러기), 천식발작, 홍반, 간지러움, 코막힘, 심장-호흡기 장애, 때때로 발진, 부종, 두드러기, 비염증상, 결막염, 드물게 독성표피괴사용해(리엘증후군), 피부점막안증후군(스티븐스-존슨증후군), 박탈성피부염, 드물게 재생불량성빈혈, 빈혈, 백혈구감소, 혈소판감소, 혈소판기능 저하(출혈시간의 지연), 귀에서 소리가 남, 귀 먹음, 어지러움, 두통, 흥분, 드물게 간장애, 매우 드물게 간 트랜스아미나제 상승에 따른 일시적인 간손상, 신장애, 급성신부전, 과호흡, 대사성산증, 과도한 체온강하, 허탈, 사지냉각 등이 나타나는 경우 복용을 즉각 중지하고 의사 또는 약사와 상담하십시오.\n\n식욕부진, 가슴쓰림, 위통, 구역, 구토 등이 나타날 수 있습니다.\n",
                "depositMethodQesitm": "실온에서 보관하십시오.\n\n어린이의 손이 닿지 않는 곳에 보관하십시오.\n",
                "openDe": "2021-10-01 00:00:00",
                "updateDe": "2022-08-19",
                "itemImage": "https://nedrug.mfds.go.kr/pbp/cmn/itemImageDownload/154599017940000101",
                "bizrno": "2088100281"
            }
        }
    ]
    ```

- [ POST ] 알림 생성 `/alarm`

  Request

    ```json
    {
        "targetId": 1,
        "hour": 18,
        "minute": 21,
        "is_enabled": true,
        "name": "혈압약",
        "count": 2,
        "itemSeq": "20220101",
    		"imgage_url": "/public/img"
    }
    ```

  Response

    ```json
    {
    	"id": 7,
    	"hour": 18,
    	"minute": 21,
    	"is_enabled": true,
    	"name": "혈압약",
      "count": 2,
      "itemSeq": "20220101",
    	"imgage_url": "/public/img"
    }
    ```

- [ PATCH ] 알림 수정 `/alarm`

  Request

    ```json
    {
    	alarmId: 1,
    	hour: 13,
    	minute: 31
    }
    ```

</aside>

<aside>
🗨️

## Chat

- [ GET ] 채팅 기록 조회 `/chat/histroy`

    ```
    [
        {
            "id": 1,
            "content": "hello world",
            "sender_type": "ai",
            "createdAt": "2025-08-09T15:22:38.193Z"
        },
        {
            "id": 2,
            "content": "who am i?",
            "sender_type": "user",
            "createdAt": "2025-08-09T15:32:47.956Z"
        }
    ]
    ```

- [ GET ] 약물 상호작용 분석 `/chat/risk`
    - `/chat/risk?targetId=2` : targetId는 사용자 ID

    ```json
    {
        "collisionCount": 0,
        "collisions": [],
        "count": 3,
        "duplicateCount": 1,
        "duplicates": [
            "아스피린"
        ],
        "errors": [],
        "pairCount": 3,
        "riskRate": 33,
        "warnings": [
            {
                "ingredient": "아스피린",
                "reason": "",
                "type": "[중복 성분]"
            }
        ]
    }
    ```

- [ POST ] 채팅 AI 전송  `/chat`

  Request

    ```json
    {
    	"content" : "hello world!"
    }
    ```

  Response

    ```json
    {
    	"id": 1,
    	"content": "hello world",
    	"sender_type": "ai",
    	"createdAt": "2025-08-09T15:22:38.193Z"
    }
    ```

</aside>

<aside>
🗓️

## **IntakeLog**

- [ GET ] 지정한 달의 복용 기록 `/intake-log`
    - `/intake-log?month=8`

    ```json
    [
        {
            "id": 1,
            "month": 8,
            "date": 11,
            "chekced_percent": 1,
            "alarm_confirms": [
                {
                    "alarmId": 5,
                    "is_checked": true
                },
                {
                    "alarmId": 4,
                    "is_checked": true
                },
                {
                    "alarmId": 1,
                    "is_checked": true
                },
                {
                    "alarmId": 3,
                    "is_checked": true
                },
                {
                    "alarmId": 6,
                    "is_checked": true
                },
                {
                    "alarmId": 7,
                    "is_checked": true
                }
            ]
        },
        {
            "id": 2,
            "month": 8,
            "date": 12,
            "chekced_percent": 0.8334,
            "alarm_confirms": [
                {
                    "alarmId": 5,
                    "is_checked": false
                },
                {
                    "alarmId": 4,
                    "is_checked": true
                },
                {
                    "alarmId": 1,
                    "is_checked": true
                },
                {
                    "alarmId": 3,
                    "is_checked": true
                },
                {
                    "alarmId": 6,
                    "is_checked": true
                },
                {
                    "alarmId": 7,
                    "is_checked": true
                }
            ]
        }
    ]
    ```

- [ POST ] 알림 확인 `/intake-log/check`

  Request

    ```json
    { 
        "month": 8,
        "date": 12,
        "alarmId": 7
    }
    ```

  Response

    ```json
    {
        "id": 2,
        "month": 8,
        "date": 12,
        "is_checked": true,
        "alarm_confirms": [
            {
                "alarmId": 5,
                "is_checked": true
            },
            {
                "alarmId": 4,
                "is_checked": true
            },
            {
                "alarmId": 1,
                "is_checked": true
            },
            {
                "alarmId": 3,
                "is_checked": true
            },
            {
                "alarmId": 6,
                "is_checked": true
            },
            {
                "alarmId": 7,
                "is_checked": true
            }
        ]
    }
    ```

</aside>

<aside>
💽

## ERD

![image.png](attachment:7628c1e5-3af9-4c43-a48e-bf8d641dc851:image.png)

</aside>