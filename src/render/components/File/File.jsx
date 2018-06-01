import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 125px;
  height: 135px;
  border-radius: 3px;
  margin-right: 5px;
  border: 1px solid #90A4AE;
  background-image: url(${props => props.image});
  background-size: cover;
  background-position: center;
  align-items: flex-end;
  display: flex;
`;

const Name = styled.h4`
  font-family: sans-serif;
  font-size: 14px;
  color: white;
  background: rgba(0,0,0,0.75);
  margin: 0;
  padding: 7px 0 5px 0;
  text-align: center;
  height: 20px;
  width: 100%;
`;

function File({ image, filename }) {
  return (
    <Container image={image}>
      <Name>{filename}</Name>
    </Container>
  );
}

export default File;
