import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
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
 * 1. WalletLinkConnector 연동 완료
 */

type Account = string | null | undefined;
type Library = Web3Provider | undefined;
type ChainId = number | undefined;

function App() {
  const ethereum = (window as any).ethereum;
  const { chainId, account, active, activate, deactivate, library, setError } =
    useWeb3React<Web3Provider>();

  const connectMetaMask = async () => {
    const initInjected = new InjectedConnector({});
    await activate(initInjected);

    if (isCheckedChainId(chainId)) {
      await getData(account, library);
    } else {
      changeChainId(97);
    }
  };

  const connectWalletLink = async () => {
    const walletLink = new WalletLinkConnector({
      url: "https://rinkeby.infura.io/v3/<my-api-key>",
      appName: "hash_like",
    });
    await activate(walletLink);
  };

  const connectWalletConnect = async () => {
    const walletConnect = new WalletConnectConnector({});
    await activate(walletConnect);
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
      <button type="button" onClick={handleOnClick(connectMetaMask)}>
        메타 마스크 연결
      </button>
      <button type="button" onClick={handleOnClick(connectWalletConnect)}>
        Wallet Connect 연결
      </button>
      <button type="button" onClick={handleOnClick(connectWalletLink)}>
        Wallet Link 연결
      </button>
      <button type="button" onClick={handleOnClick(disConnectWallet)}>
        지갑 연결 해제
      </button>
    </div>
  );
}

export default App;
