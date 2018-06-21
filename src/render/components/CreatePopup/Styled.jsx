import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
`;

export const Form = styled.form`
  width: 100%;
  background: white;
  padding: 20px;
`;

export const ProgressContainer = styled.div`
  width: 100%;
  display: flex;
  padding: 40px 0;
  justify-content: center;
`;

export const ActionButton = styled.button`
  width: 100%;
  height: 30px;
  background: #039be5;
  color: white;
  margin: 20px 0;
  border: none;
  border-radius: 2px;
  box-shadow: 0px 1px 6px 2px rgba(0,0,0,0.125);
  cursor: pointer;
  transition: all 0.25s;

  &:hover {
    opacity: 0.75;
  }

  &:disabled {
    background: rgba(0,0,0,0.25);
    color: rgba(255,255,255, 0.5);
    box-shadow: 0px 1px 6px 2px rgba(0,0,0,0);
    cursor: not-allowed;
  }
`;
