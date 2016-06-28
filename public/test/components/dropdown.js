const test = require('tape')
require('jsdom-global')()

const Dropdown = require('../../src/components/dropdown')

test('dropdown: supports array of item strings', (t) => {
  t.plan(1)
  const tree = Dropdown({
    items: ['foo', 'bar']
  })
  t.equal(tree.querySelectorAll('option').length, 2, 'has two <option> elements')
})

test('dropdown: supports array of item objects', (t) => {
  t.plan(3)
  const tree = Dropdown({
    items: [
      { value: 'a', label: 'The first' },
      { value: 'b', label: 'The second' }
    ]
  })
  t.equal(tree.querySelectorAll('option').length, 2, 'has two <option> elements')
  const lastChild = tree.querySelector('option:last-child')
  t.equal(lastChild.value, 'b', 'sets value property')
  t.equal(lastChild.text, 'The second', 'sets label') // innerText is undefined...?
})

test('dropdown: sets selected option', (t) => {
  t.plan(1)
  const tree = Dropdown({
    items: ['a', 'b', 'c'],
    selected: 'b'
  })
  t.equal(tree.querySelectorAll('option')[1].getAttribute('selected'), 'selected', 'has selected attribute set')
})

test('dropdown: sets attributes on element', (t) => {
  t.plan(2)
  const tree = Dropdown({
    items: ['a', 'b'],
    attributes: {
      id: 'foo',
      className: 'bar'
    }
  })
  t.equal(tree.getAttribute('id'), 'foo', 'has id attribute set')
  t.ok(tree.classList.contains('bar'), 'has bar in class list')
})
