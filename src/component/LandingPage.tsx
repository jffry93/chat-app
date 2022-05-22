import styled from 'styled-components';

const LandingPage = () => {
  return (
    <StyledLanding>
      <h2>A free Chatapp</h2>
      <span>No phone number needed</span>
      <br />
      <p>Must have a Google acount</p>
    </StyledLanding>
  );
};

export default LandingPage;

const StyledLanding = styled.div`
  height: var(--container-height);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
