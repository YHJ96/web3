import { InjectedConnector } from "@web3-react/injected-connector";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

/**
 * [ 바이낸스 네트워크로 연결하기 ]
 * 1. 최초의 지갑을 연결하여 chainId를 확인한다.
 * 2. 97번 바이낸스 메인넷인지 확인한다.
 * 3. 바이낸스 메인넷이 아니라면 네트워크를 바꾸는 창을 출력한다.
 */

/**
 * [ walletconnect 지갑으로 연결하기 ]
 */

type Account = string | null | undefined;
type Library = Web3Provider | undefined;
type ChainId = number | undefined;

interface Ethereum extends Window {
  ethereum: {
    request(args: RequestArguments): Promise<unknown>;
  };
}

interface RequestArguments {
  method: string;
  params?: unknown[] | object;
}

function App() {
  const ethereum = (window as unknown as Ethereum).ethereum;
  const { chainId, account, active, activate, deactivate, library, setError } =
    useWeb3React<Web3Provider>();

  const connectWallet = async () => {
    const initInjected = new InjectedConnector({});
    await activate(initInjected);

    if (isCheckedChainId(chainId)) {
      await getData(account, library);
    } else {
      changeChainId(97);
    }
  };

  const disConnectWallet = () => {
    if (active) {
      return deactivate();
    }
  };

  const isCheckedChainId = (chainId: ChainId) => {
    if (chainId === 97 && active) {
      return true;
    } else {
      return false;
    }
  };

  const changeChainId = async (chainId: number) => {
    const toHexChainId = `0x${chainId.toString(16)}`;
    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: toHexChainId }],
      });
    } catch (err) {
      const error = err as Error;
      setError(error);
      alert(error.message);
    }
  };

  const initWalletConnect = () => {};

  const handleOnClick = (callback: (...args: any) => any) => () => callback();

  const getData = async (account: Account, library: Library) => {
    if (account) {
      try {
        await library?.getBalance(account);
      } catch (err) {
        const error = err as Error;
        throw error.message;
      }
    }
  };

  return (
    <div>
      <div>
        <div>현재 지갑 상태</div>
        <p>네트워크 아이디 {chainId}</p>
        <p>지갑 주소 {account}</p>
      </div>
      <button type="button" onClick={handleOnClick(connectWallet)}>
        메타 마스크 연결
      </button>
      <button type="button" onClick={handleOnClick(disConnectWallet)}>
        메타 마스크 연결해제
      </button>
      <button type="button" onClick={handleOnClick(initWalletConnect)}>
        Wallet Connect
      </button>
    </div>
  );
}

export default App;
