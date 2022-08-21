/* eslint-disable @typescript-eslint/no-var-requires,import/no-extraneous-dependencies */
const dotenv = require('dotenv')
const path = require('path')

require('@babel/register')({
  configFile: './babel.config.json',
  extensions: ['.js', '.jsx', '.ts', '.tsx'],
})

dotenv.config({
  path: path.resolve(__dirname, '.env.local'),
})

const chai = require('chai')
const sinonChai = require('sinon-chai')

chai.use(sinonChai)
