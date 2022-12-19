import { useEffect } from "react";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

type Account = string | null | undefined;
type Library = Web3Provider | undefined;

const injected = new InjectedConnector({});

function App() {
  const { chainId, account, active, activate, deactivate, library } =
    useWeb3React<Web3Provider>();

  const handleConnect = () => {
    activate(injected, (err) => {
      const error = err as Error;
      if (error) {
        throw error.message;
      }
    });
  };

  const handleDisConnect = () => {
    if (active) {
      return deactivate();
    }
  };

  const getData = async (account: Account, library: Library) => {
    if (account) {
      const result = await library?.getBalance(account);
      console.log(result);
    }
  };

  useEffect(() => {
    getData(account, library);
  }, [account, library]);

  return (
    <div>
      <div>
        <div>현재 지갑 상태</div>
        <p>네트워크 아이디 {chainId}</p>
        <p>지갑 주소 {account}</p>
      </div>
      <button type="button" onClick={handleConnect}>
        메타 마스크 연결
      </button>
      <button type="button" onClick={handleDisConnect}>
        메타 마스크 연결해제
      </button>
    </div>
  );
}

export default App;
