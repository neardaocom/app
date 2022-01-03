# near-dao
DAOs on NEAR
VueJS application

## Requirements
MDB Vue Advanced UI KIT (https://mdbootstrap.com/docs/b5/vue/#!)

## Logging policy
Examples:
[83924729384723...324324][B][User][Login] Wallet [dao.near] is logged in
[83924729384723...324324][B][User][Logout] Wallet [dao.near] is logged out
[83924729384723...324324][D][app@Components/Dao/ModalAddDocument][Validation] Root near account [test.dao.near] is not valid

Pattern:
[x-correlation-id][x-lvl][x-target][x-action] Message


x-correlation-id: Tracking request unique ID
- example: {session-id}-substr(uniqid('', true),-8)

x-lvl: Main classification
- (D)EVELOPER: Developlment purpose in models, libraries,...
- (O)PS: Maintenance purpose
- (B)USINESS: Product purpose

x-target: WHERE is it happend
- Domain entity(B)
- object (O/D) 

x-action: Context

Message: WHAT is happened
- with params in "[]"


## Project setup
Get MDB Vue Advanced UI KIT and copy to mdb dir, than install npm
```
mkdir mdb
cp <path_to_downloaded_ui_kit>/mdb-vue-ui-kit-1.4.0.tgz ./mdb
npm install
```

## Testing

### Unit test
npm run test:unit

Run specific test
npm run test:unit tests/unit/models/auction

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```
for testnet
```
npm run build_mainnet
```
for mainnet

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).