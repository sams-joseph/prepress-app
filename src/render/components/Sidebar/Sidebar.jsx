import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import SettingsIcon from '@material-ui/icons/Settings';
import HistoryIcon from '@material-ui/icons/History';
import RedoIcon from '@material-ui/icons/Redo';
import RefreshIcon from '@material-ui/icons/Refresh';

const SidebarContainer = styled.div`
  width: 200px;
  height: 100%;
  background: #313942;
  padding: 64px 0 20px 0;
`;

const SidebarHeading = styled.h2`
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

const Nav = styled.div`
  width: 100%;
  margin-bottom: 40px;
`;

const NavItem = styled(Link)`
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

function Sidebar({ active, children }) {
  return (
    <SidebarContainer>
      <SidebarHeading>Processes</SidebarHeading>
      <Nav>
        <NavItem
          to="/"
          className={active === 'home' ? 'active' : ''}
        >
          <RedoIcon style={{ height: '18px', width: '18px', marginRight: '10px' }} />
          <span>
                      Rename
          </span>
        </NavItem>
        <NavItem
          to="/reset"
          className={active === 'reset' ? 'active' : ''}
        >
          <RefreshIcon style={{ height: '18px', width: '18px', marginRight: '10px' }} />
          <span>
                      Reset
          </span>
        </NavItem>
      </Nav>
      {children}
      <SidebarHeading>More</SidebarHeading>
      <Nav>
        <NavItem
          to="/logs"
          className={active === 'logs' ? 'active' : ''}
        >
          <HistoryIcon style={{ height: '18px', width: '18px', marginRight: '10px' }} />
          <span>
                      Logs
          </span>
        </NavItem>
        <NavItem
          to="/settings"
          className={active === 'settings' ? 'active' : ''}
        >
          <SettingsIcon style={{ height: '18px', width: '18px', marginRight: '10px' }} />
          <span>
                      Settings
          </span>
        </NavItem>
      </Nav>
    </SidebarContainer>
  );
}

export default Sidebar;
