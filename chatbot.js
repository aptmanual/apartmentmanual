/* 아파트 사용설명서 AI 챗봇 — chatbot.js
   사용법: </body> 직전에 아래 두 줄 추가
   <link rel="stylesheet" href="chatbot.css">
   <script src="chatbot.js"></script>
*/

(function () {
  'use strict';

  /* ── 지식베이스 (실제 상담 48,109건 기반) ── */
  var KB = [
    {
      keys: ['주방수전','싱크대 수전','주방 수전','싱크헤드','싱크호스','주방 누수'],
      title: '주방수전 누수 / 작동 불량',
      intro: '주방수전은 상담이 가장 많은 항목입니다. 싱크대 아래 호스 누수인지, 수전 본체 문제인지 먼저 확인해 보세요.',
      steps: [
        { tag:'diy', title:'싱크대 아래에서 물이 새요 — 위치부터 확인',
          body:'<ul><li><b>고압호스 연결부 누수</b> → 스패너로 조이기만 해도 해결되는 경우가 많습니다</li><li><b>싱크헤드/싱크호스 누수</b> → 동일 제조사 제품으로 단품 교체 가능합니다</li><li><b>레버 아래 본체 연결부 누수</b> → 제조사 AS 대상입니다</li></ul><div class="hb-tip">💡 손전등으로 아래를 비춰보면 누수 위치를 쉽게 찾을 수 있어요</div>' },
        { tag:'diy', title:'싱크헤드가 잘 안 당겨지거나 호스가 안 늘어나요',
          body:'<ul><li>싱크대 아래 수납장을 열어 호스가 꼬이거나 눌려 있는지 확인하세요</li><li>호스가 걸리지 않도록 정리하면 바로 해결됩니다</li></ul>' },
        { tag:'as', title:'온수가 안 나오거나 레버가 뻑뻑해요',
          body:'<ul><li>카트리지(수전 내부 온도 조절 부품) 마모가 원인인 경우가 많습니다</li><li>수전 브랜드를 확인해 제조사 고객센터에 AS 문의하세요</li><li>대표 브랜드: 대림바스(1588-4848), 아메리칸스탠다드, 이누스, 한샘</li></ul>' },
        { tag:'pro', title:'수전 전체를 교체하고 싶어요',
          body:'<ul><li>현재 수전의 홀 개수(1홀/2홀) 확인이 필요합니다</li><li>필터 수전, 절수 페달 방식으로 업그레이드도 가능합니다</li><li>원하는 제품 직접 구매 후 설치만 의뢰하는 것도 가능합니다</li></ul>' }
      ]
    },
    {
      keys: ['세면수전 물이 새','세면수전 누수','세면수전','세면 수전','세면기 수전'],
      title: '세면수전 누수 / 작동 불량',
      intro: '세면수전 누수는 고압호스 연결부 이완이 가장 흔한 원인입니다. 아래에서 차례로 확인해보세요.',
      steps: [
        { tag:'diy', title:'수전 아래에서 물이 뚝뚝 떨어져요',
          body:'<ul><li>세면대 아래 수납장을 열어 냉·온수 고압호스 연결부를 확인하세요</li><li>연결 나사가 느슨하면 스패너로 조이기만 해도 해결됩니다</li><li>호스 자체가 부풀거나 금이 갔다면 동일 규격의 새 호스로 교체하세요</li></ul><div class="hb-tip">💡 고압호스는 길이·규격만 맞으면 마트에서 바로 구매 가능합니다</div>' },
        { tag:'diy', title:'수압이 약하거나 물이 조금씩 새요',
          body:'<ul><li>수전 끝 토수구의 에어레이터(작은 거름망)를 분리해 청소하세요</li><li>반시계 방향으로 돌리면 분리되고, 식초물에 30분 담그면 석회질이 제거됩니다</li></ul>' },
        { tag:'as', title:'핸들이 부러졌거나 본체에서 새요',
          body:'<ul><li>수전 브랜드를 확인해 제조사 고객센터에 AS 문의하세요</li><li>설치 후 10년 이내라면 무상 수리 가능한 경우도 있습니다</li></ul>' },
        { tag:'pro', title:'교체를 원하거나 위 방법으로 해결이 안 돼요',
          body:'<ul><li>원홀/투홀 방식 확인 후 교체합니다</li><li>직접 구매한 수전 설치 의뢰도 가능합니다</li></ul>' }
      ]
    },
    {
      keys: ['방등','거실등','전등 안','조명 안','형광등 안','LED 안 켜','불이 안 켜','방 불','안정기'],
      title: 'LED 방등 / 거실등 점등 불량',
      intro: '방등·거실등이 안 켜지는 원인은 ① 램프 수명 종료 ② 안정기 고장 ③ 스위치·배선 문제 순입니다.',
      steps: [
        { tag:'diy', title:'램프부터 교체해보세요',
          body:'<ul><li>형광등 램프를 새 것으로 교체하세요 (T5/T8 규격 확인)</li><li>램프 양 끝이 까맣게 변색됐다면 수명이 다한 것입니다</li><li>새 램프로 교체했는데도 안 켜지면 → 안정기 문제입니다</li></ul><div class="hb-tip">💡 형광등 램프는 하드웨어점에서 규격만 맞으면 바로 구매 가능해요</div>' },
        { tag:'diy', title:'안정기를 교체해보세요',
          body:'안정기는 형광등에 전류를 공급하는 부품으로, 고장나면 램프를 교체해도 불이 안 켜집니다.<ul><li>차단기를 내리고 등기구 커버를 분리하세요</li><li>안정기에 적힌 규격과 동일한 제품으로 교체하세요</li></ul><div class="hb-warn">⚠️ 전기 작업이 익숙하지 않으시면 전문가에게 맡기는 것이 안전합니다</div>' },
        { tag:'pro', title:'램프·안정기 교체 후에도 안 켜져요',
          body:'<ul><li>스위치를 눌러도 딸깍 소리가 없으면 → 스위치 교체 필요</li><li>여러 방 전등이 동시에 안 켜지면 → 차단기 확인 후 배선 점검 필요</li><li>LED 일체형 등기구는 등기구 전체 교체가 필요합니다</li></ul>' }
      ]
    },
    {
      keys: ['샤워수전','샤워기','샤워 물','샤워 누수','해바라기','슬라이드바','샤워 온수','샤워 핸들','샤워 새'],
      title: '샤워수전 누수 / 작동 불량',
      intro: '샤워수전 문제는 ① 물이 새는 경우 ② 온도 조절 불량 ③ 부품 파손으로 나뉩니다.',
      steps: [
        { tag:'diy', title:'샤워헤드에서 물이 새거나 수압이 약해요',
          body:'<ul><li>샤워헤드를 분리해 식초물에 30분 담근 뒤 핀으로 구멍을 뚫어주세요</li><li>샤워기 줄 연결부가 느슨하면 손으로 조이기만 해도 해결됩니다</li><li>호스가 삭거나 부풀었다면 같은 규격의 새 호스로 교체하세요</li></ul><div class="hb-tip">💡 샤워헤드 거름망 청소만으로 수압이 2배가 되는 경우도 많아요</div>' },
        { tag:'diy', title:'온수가 안 나오거나 온도 조절이 안 돼요',
          body:'<ul><li>레버를 온수 방향으로 끝까지 돌려봐도 차갑다면 카트리지 고장 가능성이 높습니다</li><li>다른 수전에서 온수가 나오는지 먼저 확인하세요 — 보일러 문제일 수 있습니다</li></ul><div class="hb-warn">⚠️ 카트리지 교체는 수전 종류마다 달라 제조사 AS 또는 전문가가 필요합니다</div>' },
        { tag:'as', title:'본체에서 물이 새거나 핸들이 파손됐어요',
          body:'<ul><li>수전 브랜드를 확인해 제조사 고객센터에 AS 문의하세요</li><li>대표 브랜드: 대림바스(1588-4848), 아메리칸스탠다드, 이누스</li></ul>' },
        { tag:'pro', title:'수전 전체 교체를 원해요',
          body:'<ul><li>해바라기 수전, 슬라이드바 방식 등 원하는 타입으로 변경 가능합니다</li><li>직접 구매한 수전 설치 의뢰도 가능합니다</li></ul>' }
      ]
    },
    {
      keys: ['싱크대 막','싱크대 배수','하수구 역류','싱크대 냄새','배수통','관통','배수가 안','싱크 막'],
      title: '싱크대 배수 막힘 / 악취',
      intro: '싱크대 배수 문제는 음식 찌꺼기와 기름때가 배관에 쌓이는 것이 주 원인입니다.',
      steps: [
        { tag:'diy', title:'배수가 느리거나 막혔어요',
          body:'<ul><li>배수통 위 거름망을 분리해 음식 찌꺼기를 제거하세요</li><li>싱크대 아래 U자형 트랩을 분리해 내부를 청소하세요</li><li>끓는 물을 부으면 기름때를 녹이는 데 효과적입니다</li></ul><div class="hb-tip">💡 주 1회 끓는 물 붓는 습관만으로 배관 막힘을 크게 줄일 수 있어요</div>' },
        { tag:'diy', title:'하수구 냄새가 올라와요',
          body:'<ul><li>거름망 안 봉수컵이 제자리에 있는지 확인하세요</li><li>봉수컵이 없거나 파손됐다면 악취방지캡을 하수관 입구에 씌워주세요</li></ul>' },
        { tag:'pro', title:'물이 역류하거나 완전히 막혔어요',
          body:'<ul><li>전동 스프링 장비로 하수관 내부를 관통하는 작업이 필요합니다</li></ul><div class="hb-warn">⚠️ 역류가 반복되면 아랫집 누수로 이어질 수 있으니 빨리 해결하세요</div>' }
      ]
    },
    {
      keys: ['환풍기','팬 소리','환풍 소음','담배 냄새','댐퍼','덜덜','욕실 팬','환풍기 안'],
      title: '화장실 환풍기 소음 / 고장',
      intro: '환풍기 문제는 ① 소음 ② 작동 안 됨 ③ 이웃집 냄새 역류 세 가지 유형이 대부분입니다.',
      steps: [
        { tag:'diy', title:'소음이 심하거나 덜덜거려요 — 청소부터',
          body:'환풍기 소음의 70% 이상은 먼지 때문입니다.<ul><li>그릴(커버)을 아래로 당기거나 돌려 분리하세요</li><li>팬 날개와 모터 주변 먼지를 솔이나 에어건으로 제거하세요</li><li>그릴망은 물로 씻어 완전히 말린 후 재장착하세요</li></ul><div class="hb-tip">💡 청소 후 소음이 절반 이하로 줄어드는 경우가 많습니다</div>' },
        { tag:'as', title:'청소해도 소음이 계속되거나 작동이 안 돼요',
          body:'<ul><li>환풍기 브랜드와 모델명을 확인하세요 (그릴 안쪽에 표시)</li><li>제조사에 AS 문의하거나 10년 이상 됐다면 교체를 고려하세요</li></ul>' },
        { tag:'pro', title:'이웃집 담배 냄새가 역류해요',
          body:'<ul><li>전동댐퍼를 추가 설치하면 냄새 역류를 막을 수 있습니다</li><li>전동댐퍼 내장 제품으로 환풍기를 교체하는 방법도 있습니다</li></ul><div class="hb-warn">⚠️ 단순 환풍기 교체만으로는 냄새 역류가 해결되지 않습니다 — 댐퍼가 핵심입니다</div>' }
      ]
    },
    {
      keys: ['변기','물이 계속','물이 안 멈','졸졸','물통','물이 안 내려','물통부속','변기 막','비데','물통에서 소리','물 소리'],
      title: '변기 물통부속 / 막힘',
      intro: '변기 문제 중 가장 흔한 것은 물이 졸졸 계속 흐르는 것입니다. 물통 뚜껑을 열어 내부를 보면 원인을 바로 알 수 있어요.',
      steps: [
        { tag:'diy', title:'물이 멈추지 않거나 졸졸 소리가 나요',
          body:'변기 뒤 물통 뚜껑을 열어 내부를 확인하세요.<ul><li><b>바닥 고무마개(플래퍼)가 들떠 있으면</b> → 플래퍼 교체 (가장 흔한 원인)</li><li><b>물이 오버플로우관 위로 넘치면</b> → 플로트볼 높이 조정</li><li><b>부표가 물에 잠겨 있으면</b> → 필밸브 교체 필요</li></ul><div class="hb-tip">💡 물통 부속 교체는 유튜브 보며 직접 할 수 있어요. 부품은 인터넷·철물점에서 구매 가능합니다</div>' },
        { tag:'diy', title:'물통 옆 호스에서 물이 새요',
          body:'<ul><li>고압호스 연결부를 스패너로 조여보세요</li><li>호스가 삭거나 부풀었다면 동일 길이의 새 호스로 교체하세요</li></ul>' },
        { tag:'diy', title:'물이 안 내려가요 (막힘)',
          body:'<ul><li>뚫어뻥으로 5~10회 반복해서 압축해보세요</li><li>물을 가득 채운 후 한 번에 내리는 방법도 효과적입니다</li></ul><div class="hb-warn">⚠️ 뚫어뻥으로 해결이 안 되면 전문가의 스프링 관통 작업이 필요합니다</div>' },
        { tag:'as', title:'비데 작동이 안 돼요',
          body:'<ul><li>전원 코드가 빠져 있는지 먼저 확인하세요</li><li>브랜드 고객센터에 AS 문의하세요 (코웨이, 노비타, 대림 등)</li></ul>' },
        { tag:'pro', title:'변기 아래 바닥에서 물이 새거나 변기가 흔들려요',
          body:'<ul><li>변기 바닥 연결부 가스켓 교체 또는 재설치 필요</li><li>도기 자체에 금이 가 있으면 변기 전체 교체가 필요합니다</li></ul>' }
      ]
    },
    {
      keys: ['손잡이','문손잡이','문고리','경첩','문이 안 열','문이 안 잠','헛돌아','삐걱','방문 손잡이'],
      title: '방문 손잡이 / 경첩',
      intro: '방문 손잡이 문제는 대부분 직접 교체하거나 간단히 수리할 수 있습니다.',
      steps: [
        { tag:'diy', title:'손잡이가 헛돌거나 문이 안 열려요',
          body:'방문 손잡이는 규격만 맞으면 직접 교체할 수 있습니다.<ul><li>손잡이 커버를 분리하면 나사가 보입니다 → 풀면 손잡이가 분리됩니다</li><li>래치볼트 크기와 백세트(손잡이 중심~문끝 거리)를 측정해 같은 규격으로 구매하세요</li></ul><div class="hb-tip">💡 드라이버 하나로 30분이면 됩니다. 유튜브 영상을 참고하세요</div>' },
        { tag:'diy', title:'경첩이 삐걱거리거나 문이 처져요',
          body:'<ul><li>경첩에 WD-40 또는 식용유를 바르세요</li><li>나사가 헐거워진 경우 더 긴 나사로 교체하면 단단히 고정됩니다</li></ul>' },
        { tag:'pro', title:'문틀이 뒤틀렸거나 문이 닫히지 않아요',
          body:'<ul><li>문짝 자체가 뒤틀린 경우 대패 가공 또는 문짝 교체가 필요합니다</li></ul>' }
      ]
    },
    {
      keys: ['세면대 막','세면대 배수','폽업','배수 느려','세면대 냄새','뚫어펑','세면대 배수구'],
      title: '세면대 배수 불량 / 악취',
      intro: '세면대 배수 문제는 폽업 마개나 배수관에 머리카락이 쌓인 것이 원인입니다.',
      steps: [
        { tag:'diy', title:'물이 느리게 내려가거나 막혔어요',
          body:'<ul><li>배수구 중앙 폽업 마개를 손으로 당겨 위로 빼거나 아래 폽업 레버를 분리하세요</li><li>마개와 배수관 입구에 엉킨 머리카락을 제거하세요</li><li>베이킹소다 → 식초 → 뜨거운 물 순서로 부으면 효과적입니다</li></ul><div class="hb-tip">💡 한 달에 한 번 폽업 마개 청소로 막힘을 예방하세요</div>' },
        { tag:'diy', title:'하수구 냄새가 올라와요',
          body:'<ul><li>물 한 컵을 천천히 부어주세요 — 냄새 차단용 물(봉수)이 증발한 경우입니다</li><li>폽업 마개 분리 후 청소하면 냄새가 사라지는 경우가 많습니다</li></ul>' },
        { tag:'pro', title:'뚫어뻥으로도 해결이 안 돼요',
          body:'<ul><li>배관 깊은 곳 막힘 → 하수구 관통 작업 필요</li><li>배관 연결부 누수 → 폽업트랩 교체 필요</li></ul>' }
      ]
    },
    {
      keys: ['센서등','현관 불','센서 안','계속 켜져','꺼지지 않','신발장 불','현관 센서'],
      title: '현관 센서등 불량',
      intro: '센서등 문제는 ① 안 켜지는 경우 ② 꺼지지 않는 경우 두 가지입니다.',
      steps: [
        { tag:'diy', title:'센서등이 안 켜져요',
          body:'<ul><li>센서를 손으로 가려 어둡게 만든 상태에서 움직여보세요 (낮에 밝으면 안 켜질 수 있음)</li><li>기존과 동일한 규격의 새 램프로 교체해보세요</li></ul>' },
        { tag:'diy', title:'센서등이 꺼지지 않아요',
          body:'<ul><li>센서 표면에 먼지나 거미줄이 붙어 있는지 확인하고 닦아주세요</li><li>에어컨 바람·창문 방향을 향하고 있으면 계속 감지할 수 있습니다 — 각도를 조정해보세요</li></ul><div class="hb-warn">⚠️ 청소·각도 조정 후에도 꺼지지 않으면 교체가 필요합니다</div>' },
        { tag:'pro', title:'교체가 필요해요',
          body:'<ul><li>기존 센서등의 규격(크기, 소켓 타입)을 확인해 동일한 규격으로 교체합니다</li><li>천장 배선 연결이 필요한 경우 전기 자격자가 필요합니다</li></ul>' }
      ]
    },
    {
      keys: ['스위치','콘센트','전등 스위치','눌러도 안','스위치 고장','스위치 깨'],
      title: '전등 스위치 / 콘센트 불량',
      intro: '스위치를 눌러도 전등이 안 켜진다면 스위치 자체 고장인 경우가 많습니다.',
      steps: [
        { tag:'diy', title:'스위치가 작동을 안 해요',
          body:'<ul><li>스위치를 눌렀을 때 딸깍 소리가 없거나 느낌이 다르면 스위치 고장입니다</li><li>기존과 동일한 규격의 스위치를 구매해 교체하세요 (1구/2구/3구 확인)</li><li>교체 전 반드시 차단기를 내려 전원을 차단하세요</li></ul><div class="hb-warn">⚠️ 차단기를 내리지 않으면 감전 위험이 있습니다</div>' },
        { tag:'diy', title:'콘센트에 전기가 안 와요',
          body:'<ul><li>차단기(분전함)가 내려가 있는지 먼저 확인하세요</li><li>해당 콘센트만 안 된다면 콘센트 자체 불량 가능성이 높습니다</li></ul>' },
        { tag:'pro', title:'교체 후에도 안 되거나 여러 개가 동시에 문제면',
          body:'<ul><li>배선 자체 문제로 전문가의 점검이 필요합니다</li><li>누전이 의심된다면 즉시 차단기를 내리고 전문가를 부르세요</li></ul>' }
      ]
    },
    {
      keys: ['렌지후드','후드','렌지 소음','후드 소음','후드 안','흡입력','후드 고장'],
      title: '렌지후드 소음 / 고장',
      intro: '렌지후드 문제는 ① 소음·흡입력 저하 ② 작동 불능 ③ 냄새 역류 세 가지 유형입니다.',
      steps: [
        { tag:'diy', title:'소음이 심하거나 흡입력이 약해요',
          body:'<ul><li>후드 그릴망을 분리해 기름때를 중성세제로 세척하세요</li><li>그릴망 세척 후 흡입력이 개선되는 경우가 많습니다</li></ul><div class="hb-tip">💡 그릴망은 한 달에 한 번 세척하는 것이 좋습니다</div>' },
        { tag:'as', title:'작동이 완전히 안 되거나 불빛이 안 켜져요',
          body:'<ul><li>렌지후드 브랜드와 모델명을 확인해 제조사 AS를 문의하세요</li><li>불빛만 안 켜지는 경우 동일 규격 램프로 교체하면 해결됩니다</li></ul>' },
        { tag:'pro', title:'이웃집 냄새가 역류하거나 교체를 원해요',
          body:'<ul><li>후드 덕트에 전동댐퍼를 설치하면 냄새 역류를 방지할 수 있습니다</li><li>후드 교체 시 기존 덕트 구경과 설치 공간 확인이 필요합니다</li></ul>' }
      ]
    },
    {
      keys: ['도어락','현관문 잠','번호가 안','잠기질','지문인식','카드키','먹통','도어 락'],
      title: '디지털도어락 고장 / 교체',
      intro: '도어락 오작동의 절반 이상은 배터리 방전입니다. 다른 수리 전에 배터리부터 교체해보세요.',
      steps: [
        { tag:'diy', title:'가장 먼저 — 배터리 교체',
          body:'<ul><li>도어락 내부 배터리 칸을 열고 AA 알카라인 건전지로 교체하세요</li><li>비상 시 외부 하단 단자에 9V 배터리를 대면 임시로 작동시킬 수 있습니다</li></ul><div class="hb-tip">💡 "삐삐삐" 배터리 경고음이 울리면 바로 교체하세요. 완전 방전되면 문이 잠길 수 있습니다</div>' },
        { tag:'diy', title:'지문인식이 안 돼요',
          body:'<ul><li>센서 표면을 부드러운 천으로 닦아주세요</li><li>손이 건조하면 인식률이 낮아집니다 — 살짝 수분을 묻히고 시도하세요</li><li>지문을 삭제하고 다시 등록해보세요</li></ul>' },
        { tag:'as', title:'배터리 교체 후에도 오작동이 계속돼요',
          body:'<ul><li>브랜드 고객센터에 AS 문의하세요 (삼성·게이트맨·아이레보 등)</li><li>보증기간(보통 2년) 이내라면 무상 수리 가능합니다</li></ul>' },
        { tag:'pro', title:'교체를 원해요',
          body:'<ul><li>현관문 두께와 뒷판 규격을 확인해야 맞는 제품 설치가 가능합니다</li><li>원하는 제품 직접 구매 후 설치만 의뢰하는 것도 가능합니다</li></ul>' }
      ]
    },
    {
      keys: ['욕실등','화장실 등','욕실 조명','화장실 조명','욕실 불','화장실 불'],
      title: '욕실등 점등 불량',
      intro: '욕실등이 안 켜지는 원인은 ① 램프 수명 종료 ② 안정기 고장 ③ 배선 이상 순입니다.',
      steps: [
        { tag:'diy', title:'램프부터 교체해보세요',
          body:'<ul><li>욕실은 반드시 방습형 제품을 사용해야 합니다 — 일반 램프를 사용하면 금방 고장납니다</li><li>기존 램프 규격을 확인 후 동일한 방습형 제품으로 교체하세요</li></ul><div class="hb-tip">💡 욕실용 램프는 반드시 "방습형" 또는 "IP44 이상" 제품을 사용하세요</div>' },
        { tag:'as', title:'브랜드 제품이라면 AS 문의',
          body:'<ul><li>욕실등 브랜드를 확인해 AS 가능 여부를 먼저 문의하세요</li></ul>' },
        { tag:'pro', title:'램프 교체 후에도 안 켜지거나 교체를 원해요',
          body:'<ul><li>안정기 교체 또는 등기구 전체 교체가 필요합니다</li><li>욕실은 방습 등급 확인이 필수이므로 전문가에게 맡기는 것을 권장합니다</li></ul>' }
      ]
    },
    {
      keys: ['세면대 누수','세면대에서 물이 새','세면대 물 새','세면 누수','세면대 아래 물','물이 안 나와','수압이 낮','에어레이터','세면 수압'],
      title: '세면대 누수 / 물 안 나옴',
      intro: '세면대 물이 새거나 아예 안 나오는 경우입니다. 누수 위치와 원인에 따라 직접 해결이 가능한 경우가 많습니다.',
      steps: [
        { tag:'diy', title:'세면대 아래 수납장에서 물이 새요',
          body:'<ul><li>냉·온수 고압호스 연결부를 확인하세요 — 스패너로 조이기만 해도 해결되는 경우가 많습니다</li><li>호스 자체가 부풀거나 금이 갔다면 동일 규격의 새 호스로 교체하세요</li></ul><div class="hb-tip">💡 손전등으로 아래를 비춰 정확한 누수 위치를 먼저 찾으세요</div>' },
        { tag:'diy', title:'물이 안 나오거나 수압이 갑자기 약해졌어요',
          body:'<ul><li>다른 수도꼭지에서도 물이 안 나오면 → 단수입니다. 관리사무소에 문의하세요</li><li>세면대만 안 나온다면 → 에어레이터(토수구 끝 거름망) 청소를 해보세요</li><li>세면대 아래 수도 밸브가 잠겨 있는지 확인하세요</li></ul>' },
        { tag:'pro', title:'관리사무소에 감압밸브 점검 요청',
          body:'<ul><li>"세대 수압이 낮은데 감압밸브 점검 요청드립니다"라고 관리사무소에 문의하세요</li><li>무상으로 점검해주는 경우가 많습니다</li></ul>' },
        { tag:'pro', title:'청소 후에도 수압이 낮거나 계속 새요',
          body:'<ul><li>카트리지(수전 내부 부품) 교체로 해결되는 경우가 많습니다</li><li>오래된 수전이라면 전체 교체를 고려하세요</li></ul>' }
      ]
    }
  ];

  /* ── 전화번호 (문자 상담) ── */
  var TEL = '010-8955-9640';

  /* ── 아이디 카운터 ── */
  var _sc = 0;

  /* ── 키워드 매칭 ── */
  function findAnswer(q) {
    q = q.toLowerCase();
    for (var i = 0; i < KB.length; i++) {
      var item = KB[i];
      for (var j = 0; j < item.keys.length; j++) {
        if (q.indexOf(item.keys[j]) !== -1) return item;
      }
    }
    return null;
  }

  /* ── 태그 HTML ── */
  var TAGS = {
    diy: '<span class="hb-tag hb-tag-diy">✅ 직접 가능</span>',
    as:  '<span class="hb-tag hb-tag-as">📞 제조사 AS</span>',
    pro: '<span class="hb-tag hb-tag-pro">🔧 전문가</span>'
  };

  /* ── 답변 HTML 생성 ── */
  function buildAnswer(ans) {
    var h = '<strong>' + ans.title + '</strong><br>'
      + '<span style="font-size:11.5px;color:#777;">' + ans.intro + '</span><br><br>'
      + '<div style="font-size:11px;color:#aaa;margin-bottom:5px">▼ 항목을 클릭하면 자세한 설명이 펼쳐집니다</div>';

    for (var i = 0; i < ans.steps.length; i++) {
      var s = ans.steps[i];
      var id = 'hbs' + (++_sc);
      h += '<div class="hb-step">'
        + '<div class="hb-step-head" onclick="window._hbTog(\'' + id + '\')">'
        + '<div class="hb-step-num">' + (i + 1) + '</div>'
        + '<div class="hb-step-title">' + TAGS[s.tag] + ' ' + s.title + '</div>'
        + '<span class="hb-step-arr" id="hbarr_' + id + '">▶</span>'
        + '</div>'
        + '<div class="hb-step-body" id="' + id + '">' + s.body + '</div>'
        + '</div>';
    }

    /* 모바일: SMS / PC: 전화번호 표시 */
    var isMobile = /android|iphone|ipad|ipod|mobile/i.test(navigator.userAgent);
    if (isMobile) {
      var smsBody = encodeURIComponent('[아파트 사용설명서] ' + ans.title + ' 문의드립니다.');
      h += '<br><a class="hb-consult-btn" href="sms:' + TEL + '?body=' + smsBody + '">📱 문자 상담 연결 →</a>';
    } else {
      h += '<br><div style="margin-top:10px;padding:8px 12px;background:#f1f8e9;border-radius:8px;font-size:12px;color:#2e7d32;">'
        + '📞 전화 상담: <a href="tel:' + TEL + '" style="color:#2d6a2d;font-weight:600;">' + TEL + '</a>'
        + '&nbsp;&nbsp;|&nbsp;&nbsp;모바일에서 사진과 함께 문자 상담을 이용해보세요</div>';
    }
    return h;
  }

  /* ── 펼침 토글 (전역 함수) ── */
  window._hbTog = function (id) {
    var body = document.getElementById(id);
    var arr  = document.getElementById('hbarr_' + id);
    if (!body) return;
    var isOpen = body.classList.contains('hb-open');
    body.classList.toggle('hb-open', !isOpen);
    arr.textContent = isOpen ? '▶' : '▼';
  };

  /* ── 메시지 추가 ── */
  function addMsg(html, who) {
    var msgs = document.getElementById('hb-msgs');
    var d = document.createElement('div');
    d.className = 'hb-msg hb-' + who;
    d.innerHTML = html;
    msgs.appendChild(d);
    msgs.scrollTop = 99999;
  }

  /* ── 전송 ── */
  function send() {
    var inp = document.getElementById('hb-inp');
    var q = inp.value.trim();
    if (!q) return;
    inp.value = '';
    addMsg(q, 'user');

    setTimeout(function () {
      var ans = findAnswer(q);
      if (ans) {
        addMsg(buildAnswer(ans), 'bot');
      } else {
        addMsg(
          '"<strong>' + q + '</strong>"에 해당하는 항목을 찾지 못했어요.<br><br>'
          + '<span style="font-size:12px;color:#888">예) "주방수전 물이 새요" / "변기 물이 안 멈춰요" / "환풍기 소음이 심해요"</span><br><br>'
          + ((/android|iphone|ipad|ipod|mobile/i.test(navigator.userAgent))
              ? '<a class="hb-consult-btn" href="sms:' + TEL + '?body=' + encodeURIComponent('[아파트 사용설명서] 집수리 문의드립니다.') + '">📱 직접 문자 상담 →</a>'
              : '<div style="margin-top:8px;padding:8px 12px;background:#f1f8e9;border-radius:8px;font-size:12px;color:#2e7d32;">📞 <a href="tel:' + TEL + '" style="color:#2d6a2d;font-weight:600;">' + TEL + '</a> 로 전화해 주세요</div>'),
          'bot'
        );
      }
    }, 350);
  }

  /* ── 패널 열기/닫기 ── */
  function open() {
    document.getElementById('hb-panel').classList.add('hb-open');
    document.getElementById('hb-badge').style.display = 'none';
    document.getElementById('hb-inp').focus();
  }
  function close() {
    document.getElementById('hb-panel').classList.remove('hb-open');
  }

  /* ── DOM 생성 ── */
  function init() {
    /* 버튼 */
    var btn = document.createElement('button');
    btn.id = 'hb-btn';
    btn.setAttribute('aria-label', '집수리 AI 상담');
    btn.innerHTML = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">'
      + '<path d="M20 2H4a2 2 0 00-2 2v18l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2z"/></svg>'
      + '<span id="hb-badge">1</span>';
    btn.onclick = open;

    /* 칩 목록 */
    var chipData = [
      ['💧 주방수전','주방수전 물이 새요'],
      ['🚿 세면수전','세면수전 물이 새요'],
      ['💡 방등','방등이 안 켜져요'],
      ['🚿 샤워수전','샤워수전 물이 새요'],
      ['🌀 싱크대 배수','싱크대 배수가 막혔어요'],
      ['💨 환풍기','환풍기 소음이 심해요'],
      ['🚽 변기','변기 물이 안 멈춰요'],
      ['🚪 방문 손잡이','방문 손잡이가 안 열려요'],
      ['🌀 세면대 배수','세면대 배수가 느려요'],
      ['🔦 센서등','현관 센서등이 안 켜져요'],
      ['🔌 전등 스위치','전등 스위치가 안 돼요'],
      ['🍳 렌지후드','렌지후드 소음이 심해요'],
      ['🔐 도어락','도어락이 안 잠겨요'],
      ['💡 욕실등','욕실등이 안 켜져요'],
      ['💦 세면대 누수','세면대 누수가 있어요'],
    ];
    var chipsHtml = chipData.map(function (c) {
      return '<button class="hb-chip" onclick="(function(){document.getElementById(\'hb-inp\').value=\'' + c[1] + '\';window._hbSend();})()">' + c[0] + '</button>';
    }).join('');

    /* 패널 */
    var panel = document.createElement('div');
    panel.id = 'hb-panel';
    panel.innerHTML =
      '<div id="hb-header">'
      + '<div class="hb-logo">🏠</div>'
      + '<div><div class="hb-title">아파트 사용설명서 AI</div>'
      + '<div class="hb-sub">항목 클릭 시 자세한 설명 · 한빛철물마트 잠실점</div></div>'
      + '<button id="hb-close" onclick="window._hbClose()" aria-label="닫기">✕</button>'
      + '</div>'
      + '<div id="hb-chips">' + chipsHtml + '</div>'
      + '<div id="hb-msgs">'
      + '<div class="hb-msg hb-bot">안녕하세요! 집수리 증상을 말씀해 주시면 직접 해결 방법부터 전문가가 필요한 경우까지 단계별로 안내해 드려요.<br><br>'
      + '<span style="font-size:11.5px;color:#888">💡 위 버튼을 누르거나 증상을 직접 입력해보세요</span></div>'
      + '</div>'
      + '<div id="hb-inputrow">'
      + '<input id="hb-inp" placeholder="증상을 입력하세요..." autocomplete="off"/>'
      + '<button id="hb-send">전송</button>'
      + '</div>';

    document.body.appendChild(btn);
    document.body.appendChild(panel);

    /* 이벤트 */
    document.getElementById('hb-send').onclick = send;
    document.getElementById('hb-inp').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') send();
    });

    window._hbSend  = send;
    window._hbClose = close;
  }

  /* DOM 준비 후 실행 */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
