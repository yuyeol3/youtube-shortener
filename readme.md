# Youtube Shortener
시청 데이터를 통해 유튜브 동영상에서 인기있는 구간만 골라 볼 수 있습니다.

## 주요 기능
- url 입력으로 동영상 로드
- 시청 데이터를 파싱하여 그래프로 표시
- 기준 값 이상의 시청 수치를 가진 구간만 필터하여 자동 재생

## 작동 과정
1. 프론트에서 사용자가 url을 입력
2. 시청 페이지로 이동
    - yt-player 라이브러리로 동영상 플레이어를 로드
    - 백엔드 서버에서 유튜브 페이지를 파싱해 데이터 반환
      - 영상 이름
      - 시청 기록
3. 서버에서 받은 정보를 통해 프론트에서 인기 구간 자동 재생

## 사용한 라이브러리
- express

## 데모
![demo image 1](./github_image/img1.png)
![demo image 2](./github_image/img2.png)