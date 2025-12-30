import { DesignSystemRuntime } from '@frameos/runtime'
import { TokenType, TokenSource, createGlobalScope } from '@frameos/types'

const runtime = new DesignSystemRuntime()
runtime.initializeProject('Test')

runtime.createToken({
  name: 'primary',
  type: TokenType.COLOR,
  value: '#3B82F6',
  scope: createGlobalScope(),
  source: TokenSource.USER_DEFINED,
})

console.log('Tokens:', runtime.getTokens())
console.log('Stats:', runtime.getStatistics())
console.log('History:', runtime.getHistory())