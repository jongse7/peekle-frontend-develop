import styled from 'styled-components';
import { useState } from 'react';
import { alert } from '@/utils';
import { Backward } from '@/components';
import { clientAuth } from '@/apis/client';
import { ROUTES } from '@/constants/routes';
import { useNavigate } from 'react-router-dom';
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #ffffff;
  font-family: Arial, sans-serif;
`;

const BackwardWrapper = styled.div`
  position: absolute;
  top: 15px;
  left: 30px;
`;
const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: #fff;
  font-size: 20px;
  font-weight: bold;
  justify-content: center;
  margin-top: -10px;
  color: black;
  font-family: 'Pretendard', sans-serif;
  font-weight: 700;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-top: 0px;
  padding: 10px;
  color: black;
  font-family: 'Pretendard', sans-serif;
  font-weight: 700;
`;

const Subtitle = styled.p`
  font-size: 18px;
  padding: 10px;
  margin-top: -30px;
  font-family: 'Pretendard', sans-serif;
  font-weight: 400;
`;
const Box = styled.div`
  background-color: #f6f8fa;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 10px;
  padding: 10px;
`;

const BoxTitle = styled.h3`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  color: black;
  font-family: 'Pretendard', sans-serif;
  font-weight: 600;
`;

const BoxText = styled.p`
  font-size: 16px;
  color: #666;
  margin: 0;
  font-family: 'Pretendard', sans-serif;
  font-weight: 400;
`;

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 70px;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  margin-right: 8px;
  accent-color: #ec132e;
`;

const CheckboxLabel = styled.label`
  font-size: 14px;
  color: #333;
  font-family: 'Pretendard', sans-serif;
  font-weight: 600;
`;

const Footer = styled.div`
  display: flex;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 56px;
  background-color: #fff;
`;

const CancelButton = styled.button`
  width: 35%;
  background-color: #f0f0f0;
  color: #333;
  font-size: 16px;
  border: none;
  cursor: pointer;
  padding: 16px;
  font-weight: bold;
  font-family: 'Pretendard', sans-serif;
  font-weight: 700;
`;

const DeleteButton = styled.button`
  width: 65%;
  background-color: ${(props) => (props.disabled ? '#ccc' : '#ec132e')};
  color: white;
  font-size: 16px;
  border: none;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  padding: 16px;
  font-weight: bold;
  font-family: 'Pretendard', sans-serif;
  font-weight: 700;
`;

const ResignPage = () => {
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleDelete = () => {
    if (!isChecked) return;

    alert(
      '정말 탈퇴하시겠어요?\n\n탈퇴일로부터 7일 이후에는 계정이 완전히 삭제되며, 복구할 수 없어요.',
      'warning',
      '취소',
      '탈퇴',
      () => console.log('🚫 회원 탈퇴 취소됨'), // 취소 버튼 클릭
      async () => {
        try {
          await clientAuth({
            method: 'DELETE',
            url: '/users',
          });

          localStorage.clear();
          navigate(ROUTES.ONBOARDING);
        } catch (error) {
          console.error('🚨 회원 탈퇴 실패:', error);
        }
      },
    );
  };

  return (
    <Container>
      <BackwardWrapper>
        <Backward />
      </BackwardWrapper>
      <Header>회원탈퇴</Header>
      <Title>잠깐!</Title>
      <Subtitle>탈퇴 전에 유의사항을 확인해주세요.</Subtitle>
      {/*경고박스 1*/}
      <Box>
        <BoxTitle>탈퇴 후 7일 동안은 휴면 계정으로 전환돼요 📁</BoxTitle>
        <BoxText>
          휴면 계정 상태에서 다시 로그인 하시면 계정 정보를 복구할 수 있어요.
        </BoxText>
      </Box>
      {/*경고박스 2*/}
      <Box>
        <BoxTitle>계정이 삭제 된 후에는 복구가 불가능해요 🙅‍♀</BoxTitle>
        <BoxText>
          탈퇴일로부터 7일이 지나면 계정이 완전히 삭제돼요. 그 이후에는 계정을
          복구할 수 없어요.
        </BoxText>
      </Box>
      {/*경고박스 3*/}
      <Box>
        <BoxTitle>작성된 글과 댓글은 삭제지 않아요 ✍</BoxTitle>
        <BoxText>
          삭제를 원하는 글이나 댓글은 직접 삭제 후 탈퇴를 진행해주세요.
        </BoxText>
      </Box>
      <CheckboxWrapper>
        <Checkbox
          type="checkbox"
          id="confirm"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
        <CheckboxLabel htmlFor="confirm">
          유의사항을 확인했습니다.
        </CheckboxLabel>
      </CheckboxWrapper>
      <Footer>
        <CancelButton>취소</CancelButton>
        <DeleteButton disabled={!isChecked} onClick={handleDelete}>
          탈퇴하기
        </DeleteButton>
      </Footer>
    </Container>
  );
};

export default ResignPage;
