import React, { Component } from 'react';
import styled from 'styled-components';
import { ipcRenderer } from 'electron';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import notifier from 'node-notifier';
import path from 'path';

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

const ProgressContainer = styled.div`
  width: 100%;
  display: flex;
  padding: 40px 0;
  justify-content: center;
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
      loading: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    ipcRenderer.on('create-folders', () => {
      notifier.notify({
        title: this.state.order,
        message: 'WIP Folders created.',
        icon: path.join(__dirname, '/images/logo.png'),
        sound: true,
        wait: true,
      });
      this.setState({
        order: '',
        loading: false,
      });
    });
  }

  onSubmit(e) {
    e.preventDefault();
    this.setState({ loading: true });
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
        {this.state.loading ? (
          <ProgressContainer>
            <CircularProgress />
          </ProgressContainer>
        ) : (
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
        )}
      </Container>
    );
  }
}

export default CreatePopup;
