import styled from 'styled-components';

export const Container = styled.div`
  background: white;
  width: 100%;
  margin-top: 64px;
  overflow: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const Flex = styled.div`
  display: flex;
  width: 100%;
`;

export const HeaderBar = styled.div`
  background: #EFF3F6;
  height: 50px;
  width: 100%;
`;

export const Form = styled.form`
  width: 100%;
  background: white;
  padding: 20px;
  flex: 1;
`;

export const ActionButton = styled.button`
  width: 170px;
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

export const Message = styled.div`
  width: 100%;
  padding-top: 64px;
  overflow: auto;
  background: white;
`;

export const CheckmarkCircle = styled.circle`
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  stroke-width: 2;
  stroke-miterlimit: 10;
  stroke: #33b257;
  fill: none;
  animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
  @keyframes stroke {
    100% {
      stroke-dashoffset: 0;
    }
  }
`;

export const Checkmark = styled.svg`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: block;
  stroke-width: 2;
  stroke: #fff;
  stroke-miterlimit: 10;
  margin: 0 auto 30px auto;
  box-shadow: inset 0px 0px 0px #33b257;
  animation: fill 0.4s ease-in-out 0.4s forwards, scale 0.3s ease-in-out 0.9s both;
  @keyframes fill {
    100% {
      box-shadow: inset 0px 0px 0px 50px #33b257;
    }
  }
  @keyframes scale {
    0%,
    100% {
      transform: none;
    }
    50% {
      transform: scale3d(1.1, 1.1, 1);
    }
  }
`;

export const CheckmarkCheck = styled.path`
  transform-origin: 50% 50%;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
  @keyframes stroke {
    100% {
      stroke-dashoffset: 0;
    }
  }
`;
