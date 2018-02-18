import React, {Component} from 'react'
import glamorous, {Div} from 'glamorous'
import matchSorter from 'match-sorter'
import Downshift from '../../src'

class Examples extends Component {
  state = {
    selectedColor: '',
    isOpen: false,
  }

  items = ['Black', 'Red', 'Green', 'Blue', 'Orange', 'Purple']

  changeHandler = selectedColor => {
    this.setState({
      selectedColor,
      isOpen: false
    })
  }

  stateChangeHandler = (changes, stateChangeHelper) => {
    // Duplicated logic. We could DRY this code up
    const isOpen =
      (changes.inputValue
        ? matchSorter(this.items, changes.inputValue)
        : this.items
      ).length > 0

    this.setState({
      selectedColor: changes.inputValue || this.state.selectedColor,
      isOpen,
    })
  }

  render() {
    const { onSubmit } = this.props
    const { selectedColor, isOpen } = this.state;

    return (
      <div>
        <Div
          css={{
            margin: '50px auto',
            maxWidth: 600,
            textAlign: 'center',
          }}
        >
          <h2>basic example</h2>
          <Div display="flex" justifyContent="center">
            <span
              style={{
                height: '2em',
                width: '2em',
                padding: '.3em',
                borderRadius: '5px',
                marginRight: '.5em',
                backgroundColor: this.state.selectedColor
                  ? this.state.selectedColor
                  : 'transparent',
              }}
            />
            <BasicAutocomplete
              items={this.items}
              onStateChange={this.stateChangeHandler}
              onChange={this.changeHandler}
              selectedItem={selectedColor}
              isOpen={isOpen}
              onSubmit={onSubmit}
            />
          </Div>
        </Div>
      </div>
    )
  }
}

const Label = glamorous.label({fontWeight: 'bold', display: 'block'})

const Item = glamorous.div(
  {
    cursor: 'pointer',
    display: 'block',
    border: 'none',
    height: 'auto',
    textAlign: 'left',
    borderTop: 'none',
    lineHeight: '1em',
    color: 'rgba(0,0,0,.87)',
    fontSize: '1rem',
    textTransform: 'none',
    fontWeight: '400',
    boxShadow: 'none',
    padding: '.8rem 1.1rem',
    boxSizing: 'border-box',
    whiteSpace: 'normal',
    wordWrap: 'normal',
  },
  ({isActive, isSelected}) => ({
    backgroundColor: isActive ? 'lightgrey' : 'white',
    fontWeight: isSelected ? 'bold' : 'normal',
    '&:hover, &:focus': {
      borderColor: '#96c8da',
      boxShadow: '0 2px 3px 0 rgba(34,36,38,.15)',
    },
  }),
)

const Input = glamorous.input({
  fontSize: 14,
  wordWrap: 'break-word',
  lineHeight: '1em',
  outline: 0,
  whiteSpace: 'normal',
  minHeight: '2em',
  background: '#fff',
  display: 'inline-block',
  padding: '.5em 2em .5em 1em',
  color: 'rgba(0,0,0,.87)',
  boxShadow: 'none',
  border: '1px solid rgba(34,36,38,.15)',
  transition: 'box-shadow .1s ease,width .1s ease',
  margin: 0,
  marginBottom: '-2px',
  '&:hover, &focus': {
    borderColor: 'rgba(34,36,38,.35)',
    boxShadow: 'none',
  },
})

// this is just a demo of how you'd use the getRootProps function
// normally you wouldn't need this kind of abstraction 😉
function Root({innerRef, ...rest}) {
  return <div ref={innerRef} {...rest} />
}
function BasicAutocomplete({
  onSubmit,
  items,
  onChange,
  selectedItem,
  onStateChange,
  isOpen,
}) {
  return (
    <Downshift
      onChange={onChange}
      onStateChange={onStateChange}
      selectedItem={selectedItem}
      isOpen={isOpen}
      render={({
        getInputProps,
        getItemProps,
        getRootProps,
        getLabelProps,
        highlightedIndex,
        inputValue,
        isOpen,
        selectedItem,
      }) => (
        <Root {...getRootProps({refKey: 'innerRef'})}>
          <Label {...getLabelProps()}>What is your favorite color?</Label>
          <Input
            {...getInputProps({
              placeholder: 'Enter color here',
              onKeyDown: e => {
                /*
                 * When user is pressing Enter...
                 * while the menu is open...
                 * and they are not navigating the menu (nothing is highlighted)
                 */
                if (e.key === 'Enter' && isOpen && highlightedIndex === null) {
                  onSubmit(e)
                }
              },
            })}
          />
          {isOpen && (
            <div
              style={{
                border: '1px solid rgba(34,36,38,.15)',
                maxHeight: 100,
                overflowY: 'scroll',
              }}
            >
              {(inputValue ? matchSorter(items, inputValue) : items).map(
                (item, index) => (
                  <Item
                    key={item}
                    {...getItemProps({
                      item,
                      isActive: highlightedIndex === index,
                      isSelected: selectedItem === item,
                    })}
                  >
                    {item}
                  </Item>
                ),
              )}
            </div>
          )}
        </Root>
      )}
    />
  )
}
export default Examples
