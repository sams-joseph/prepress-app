import React, { Component } from 'react';
import { ipcRenderer } from 'electron';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import notifier from 'node-notifier';
import path from 'path';
import { Container, Form, ProgressContainer, ActionButton } from './Styled';

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
        message: `${this.state.order} Folders created in WIP.`,
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
                <TextField
                  id="input-with-icon-grid"
                  label="Order"
                  onChange={this.handleChange}
                  value={this.state.order}
                  name="order"
                />
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
