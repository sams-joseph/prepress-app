import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const SidebarContainer = styled.div`
  width: 200px;
  height: 100%;
  background: #313942;
  padding: 64px 0 20px 0;
`;

export const SidebarHeading = styled.h2`
  width: 100%;
  padding: 20px 20px;
  border-bottom: 1px solid #2A3139;
  margin: 0 0 10px 0;
  font-family: Roboto, sans-serif;
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 2px;
  font-weight: 300;
  color: white;
`;

export const Nav = styled.div`
  width: 100%;
  margin-bottom: 40px;
`;

export const NavItem = styled(Link)`
  align-items: center;
  display: flex;
  width: 100%;
  padding: 10px 40px;
  text-decoration: none;
  font-family: Roboto, sans-serif;
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 1px;
  font-weight: 300;
  color: rgba(255,255,255,0.75);
  border-left: 3px solid transparent;
  transition: all 0.125s;

  &:hover {
    border-left: 3px solid #039be5;
    background: #445360;
    color: rgba(255,255,255,1);
  }

  &.active {
    border-left: 3px solid #039be5;
    background: #637484;
    color: rgba(255,255,255,1);
  }
`;
