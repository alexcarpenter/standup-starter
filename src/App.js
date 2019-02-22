import React from "react";
import randomItem from "random-item";
import styled from "styled-components";
import Confetti from "react-dom-confetti";

import { config } from "./utils";
import Toggle from "./toggle";

class App extends React.Component {
  state = {
    items: [],
    selectedItem: "",
    confetti: false
  };

  componentDidMount() {
    const items = JSON.parse(localStorage.getItem("STORED_ITEMS"));

    if (items && items.length > 0) {
      this.setState({ items });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.items !== this.state.items) {
      const items = JSON.stringify(this.state.items);

      localStorage.setItem("STORED_ITEMS", items);
    }
  }

  handleSubmit = event => {
    event.preventDefault();
    const { items } = this.state;
    const newItem = this.newItem.value;
    if (newItem) {
      this.setState({
        items: [...items, newItem]
      });
    } else {
      return;
    }
    this.addForm.reset();
  };

  handleSubmit = event => {
    event.preventDefault();
    const newItem = this.newItem.value;
    if (newItem) {
      this.setState(prevState => {
        return { items: [...prevState.items, newItem] };
      });
    } else {
      return;
    }
    this.addForm.reset();
  };

  removeItem = x => {
    this.setState(({ items }) => {
      return {
        items: [...items.filter(item => item !== x)]
      };
    });
  };

  selectItem = () => {
    this.setState(
      prevState => {
        let nextItem;
        do {
          nextItem = randomItem(prevState.items);
        } while (nextItem === prevState.selectItem);
        return {
          selectedItem: nextItem,
          confetti: true
        };
      },
      () => {
        this.setState({
          confetti: false
        });
      }
    );
  };

  render() {
    const { items, selectedItem, confetti } = this.state;
    return (
      <Toggle>
        {({ isOpen, onToggle }) => (
          <Layout>
            <Sidebar className={isOpen ? "is-visible" : ""}>
              <CloseButton onClick={onToggle}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path
                    fill="#fff"
                    d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"
                  />
                </svg>
              </CloseButton>
              <form
                ref={input => (this.addForm = input)}
                onSubmit={e => this.handleSubmit(e)}
              >
                <Label>Add Name</Label>
                <FormGroup>
                  <Input type="text" ref={input => (this.newItem = input)} />
                  <InputSubmit type="submit" value="Add" />
                </FormGroup>
              </form>
              {items.length ? (
                <List>
                  {items.map((item, index) => (
                    <ListItem key={index}>
                      {item}{" "}
                      <RemoveButton onClick={() => this.removeItem(item)}>
                        &times;
                      </RemoveButton>
                    </ListItem>
                  ))}
                </List>
              ) : (
                ""
              )}
            </Sidebar>
            <div>
              <SettingsButton onClick={onToggle}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path
                    fill="#fff"
                    d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
                  />
                </svg>
              </SettingsButton>
              <SelectButton onClick={this.selectItem}>
                {selectedItem
                  ? selectedItem
                  : items.length > 0
                  ? "Click here to decide"
                  : "Add some team members"}
              </SelectButton>
              <Confetti active={confetti} config={config} />
            </div>
          </Layout>
        )}
      </Toggle>
    );
  }
}

const Layout = styled.div`
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
`;

const Sidebar = styled.div`
  position: fixed;
  right: 0;
  top: 0;
  height: 100%;
  min-width: 300px;
  background-color: #111;
  padding: 2rem;
  z-index: 100;
  transform: translateX(100%);
  transition: transform ease-in-out 0.2s;
  &.is-visible {
    transform: none;
  }
`;

const List = styled.ul`
  list-style: none;
`;

const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  &:not(:last-of-type) {
    margin-bottom: 0.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.5);
  }
`;

const Label = styled.label`
  position: absolute !important;
  height: 1px;
  width: 1px;
  overflow: hidden;
  clip: rect(1px 1px 1px 1px); /* IE6, IE7 */
  clip: rect(1px, 1px, 1px, 1px);
`;

const FormGroup = styled.div`
  margin-bottom: 2rem;
  display: flex;
  width: 100%;
`;

const Input = styled.input`
  flex: 1;
  padding: 1rem;
  border: 0;
  font: inherit;
  border-radius: 4px;
  &:focus {
    background-color: #fff;
    border-color: #1498be;
    outline: 0;
    box-shadow: 0 0 0 0.25rem #1498be;
  }
`;

const InputSubmit = styled.input`
  appearance: none;
  padding: 1rem;
  font: inherit;
  border: 0;
  margin-left: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  &:focus {
    background-color: #fff;
    border-color: #1498be;
    outline: 0;
    box-shadow: 0 0 0 0.25rem #1498be;
  }
`;

const RemoveButton = styled.button`
  appearance: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background-color: transparent;
  font-size: inherit;
  color: #fff;
  border: 0;
  cursor: pointer;
`;

const SelectButton = styled.button`
  appearance: none;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  font-family: inherit;
  font-size: 10vw;
  font-weight: 700;
  color: #fff;
  background-color: transparent;
  border: 0;
  cursor: pointer;
`;

const SettingsButton = styled.button`
  position: absolute;
  top: 2rem;
  right: 2rem;
  appearance: none;
  border: 0;
  font: inherit;
  background-color: transparent;
  color: #fff;
  z-index: 10;
  cursor: pointer;
`;

const CloseButton = styled.button`
  appearance: none;
  border: 0;
  background-color: transparent;
  margin-bottom: 2rem;
  cursor: pointer;
`;

export default App;
