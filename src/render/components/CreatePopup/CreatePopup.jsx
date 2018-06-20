import React, { Component } from 'react';
import styled from 'styled-components';
import { ipcRenderer } from 'electron';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
`;

const Form = styled.form`
  width: 100%;
  background: white;
  padding: 20px;
`;

const ActionButton = styled.button`
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

class CreatePopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      order: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    ipcRenderer.on('create-folders', () => {
      this.setState({
        order: '',
      });
    });
  }

  onSubmit(e) {
    e.preventDefault();
    ipcRenderer.send('create-folders', this.state.order);
  }

  handleChange(e) {
    this.setState({
      order: e.target.value,
    });
  }

  render() {
    return (
      <Container>
        <Form onSubmit={this.onSubmit}>
          <div>
            <FormControl fullWidth>
              <TextField id="input-with-icon-grid" label="Order" onChange={this.handleChange} value={this.state.order} name="order" />
            </FormControl>
          </div>
          <ActionButton
            aria-label="run"
            type="submit"
          >
                  Create
          </ActionButton>
        </Form>
      </Container>
    );
  }
}

export default CreatePopup;
