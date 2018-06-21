import React from 'react';
import PropTypes from 'prop-types';
import SettingsIcon from '@material-ui/icons/Settings';
import HistoryIcon from '@material-ui/icons/History';
import RedoIcon from '@material-ui/icons/Redo';
import RefreshIcon from '@material-ui/icons/Refresh';
import CreateIcon from '@material-ui/icons/CreateNewFolder';

import { SidebarContainer, SidebarHeading, Nav, NavItem } from './Styled';

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
        <NavItem
          to="/create"
          className={active === 'create' ? 'active' : ''}
        >
          <CreateIcon style={{ height: '18px', width: '18px', marginRight: '10px' }} />
          <span>
                      Create
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

Sidebar.propTypes = {
  active: PropTypes.string.isRequired,
  children: PropTypes.element,
};

Sidebar.defaultProps = {
  children: null,
};

export default Sidebar;
