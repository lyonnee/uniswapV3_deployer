# uniswapV3_deployer(Uniswap V3 部署工具)

## 部署准备
### 拉取运行依赖
```shell
npm i
```

### 参数配置
修改hardhat.config.ts
```javascript
  // 默认执行网络环境
  defaultNetwork: "hardhat",
  networks: {
    "hardhat": {},
    // 自定义网络配置
    // 网络名称
    "polygonMumbai": {
      // rpc endpoint
      url: "https://rpc.ankr.com/polygon_mumbai",
      // 账户私钥
      accounts: ["<privateKey>"]
    }
  }
```

### 部署
控制台执行命令
```shell
npx hardhat run ./scripts/01_deploy_univ3.ts --network <network name>
```
运行后程序会开始执行部署，并输出一部署的合约地址
```shell
deployed Uniswap_V3 Factory addr:  0x5FbDB2315678afecb367f032d93F642f64180aa3
deployed weth9 addr:  0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
deployed Uniswap_V3 SwapRouter addr:  0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
deployed Uniswap_V3 NFTDescriptorlibrary addr:  0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
deployed Uniswap_V3 NFTPositionDescriptor addr:  0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9
deployed Uniswap_V3 NFTPositionManager addr:  0x5FC8d32690cc91D4c39d9d3abcBD16989F87570
```

#### 部署注意事项
如果不需要部署新的WETH9合约需要注释 01_deploy_univ3.ts 中的38~41行的代码，并在*weth9_addr*变量中赋值指定的合约地址
```typescript
    // 填写已有的合约地址
    var weth9_addr = "<address>";

    // const weth9 = await deploy_WETH9(deployer);
    // console.log("deployed weth9 addr: ", weth9.address);
    // await delay(1500);
    // weth9_addr = weth9.address;
```

### 部署新的交易池
#### 修改参数配置
修改 02_deploy_pool.ts 中的地址变量
```typescript
// 取上面部署的Uniswap Factory的地址
const univ3_factory_addr = "<uniswap factory address>";

// 不需要考虑 A和B地址的顺序
const tokenA_addr = "<tokenA address>";
const tokenB_addr = "<tokenB address>";

// fee (500 || 3000 || 10000)默认只可填写这三个值，后期可调用合约接口添加更多费率选择，或者接修改源码
const fee = 500; // 0.05%
```

#### 部署
控制台执行命令
```shell
npx hardhat run ./scripts/02_deploy_pool.ts  --network <network name> 
```
控制台会返回部署交易的hash
