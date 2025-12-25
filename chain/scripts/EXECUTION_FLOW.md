# deposit_yield.js 실행 흐름 분석

## 명령어
```bash
cd /Users/taegyujeong/TSF/chain
AMOUNT=2500 npx hardhat run scripts/deposit_yield.js --network mantleSepolia
```

## 실행 흐름

### 1. Hardhat Config 로드
```javascript
// hardhat.config.js:10-14
accounts: process.env.SPV_PRIVATE_KEY 
  ? [process.env.SPV_PRIVATE_KEY]  // ⬅️ 우선순위 1
  : process.env.PRIVATE_KEY 
    ? [process.env.PRIVATE_KEY]    // ⬅️ 우선순위 2
    : []
```

**현재 로드되는 키:**
- `.env` 파일에서 `SPV_PRIVATE_KEY` 찾기
- 없으면 `PRIVATE_KEY` 사용
- **출력 보니 여전히** `0xAb3d054ACbF4a0D5551b12209d88bBA4e9248267` 사용됨
- **결론:** `SPV_PRIVATE_KEY`가 제대로 로드되지 않음

---

### 2. deposit_yield.js 실행
```javascript
// scripts/deposit_yield.js:11
const [signer] = await hre.ethers.getSigners();
```

**getSigner() 결과:**
- Hardhat config의 accounts 배열 첫 번째 키 사용
- 현재: `0xAb3d...` ❌ (deployer)
- 기대: `0x7757...` ✓ (SPV)

---

### 3. depositYield() 호출
```javascript
// scripts/deposit_yield.js:31
const depositTx = await listing.depositYield(amountWei);
```

**블록체인에서 실행:**
1. Transaction 생성 (from: signer 주소)
2. Smart Contract의 `depositYield()` 함수 호출

---

### 4. Smart Contract 검증
```solidity
// Listing.sol:110
function depositYield(...) external onlySPV nonReentrant {
    // ⬆️ onlySPV modifier 검사
}

// Listing.sol:42-44
modifier onlySPV() {
    require(msg.sender == spv, "Not SPV");  // ⬅️ 여기서 에러!
    _;
}
```

**검증 로직:**
- `msg.sender` (트랜잭션 보낸 주소) = `0xAb3d...`
- `spv` (컨트랙트에 저장된 SPV) = `0x7757...`
- **비교 결과:** 다름! ❌
- **에러 발생:** "Not SPV"

---

## 문제 원인

**`.env` 파일의 SPV_PRIVATE_KEY가 로드되지 않고 있음**

확인 방법:
```bash
# .env 파일 내용 확인
cat /Users/taegyujeong/TSF/chain/.env

# 다음과 같아야 합니다:
# PRIVATE_KEY=...
# SPV_PRIVATE_KEY=...  ⬅️ 이게 있어야 함!
```

## 해결책

1. `.env` 파일 형식 확인
2. SPV_PRIVATE_KEY 값 확인
3. 변수명 정확히 일치하는지 확인 (공백, 오타 없이)
