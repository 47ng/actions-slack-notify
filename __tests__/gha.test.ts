import { getRefContext } from '../src/gha'

test('getRefContext - branch', () => {
  expect(getRefContext('refs/heads/foo')).toEqual('branch *foo*')
  expect(getRefContext('refs/heads/foo/bar/egg')).toEqual(
    'branch *foo/bar/egg*'
  )
  expect(getRefContext('refs/heads/foo.bar-egg')).toEqual(
    'branch *foo.bar-egg*'
  )
})

test('getRefContext - tag', () => {
  expect(getRefContext('refs/tags/1.2.3')).toEqual('tag *1.2.3*')
  expect(getRefContext('refs/tags/1.2.3-beta_off-12')).toEqual(
    'tag *1.2.3-beta_off-12*'
  )
})

test('getRefContext - PR', () => {
  expect(getRefContext('refs/pull/123/merge')).toEqual('PR *#123*')
})
