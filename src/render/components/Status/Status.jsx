import React from 'react';
import styled from 'styled-components';
import File from '../File';

const Container = styled.div`
  width: 100%;
  margin-top: 40px;
  display: flex;
  flex-wrap: wrap;
`;

const Status = ({ files }) => (
  <Container>
    {
      files.map(file => <File filename={file} image={`/Volumes/G33STORE/_callas_server/BNS_STAGING/_image_export/Success/${file}vis_1.jpg`} />)
    }
  </Container>
);

export default Status;
