import React, { useState } from "react";
import { Layout, Typography, Menu, Space, Button, Dropdown, message } from "antd";
import { DownOutlined, LogoutOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

const { Header } = Layout;
const { Text } = Typography;

interface NavBarProps {
  onMintNFTClick: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ onMintNFTClick }) => {
  const location = useLocation();
  const { connect, disconnect, connected, account, network } = useWallet(); // Using Aptos wallet adapter
  const [balance, setBalance] = useState<number | null>(null); // Balance state to fetch dynamically

  const handleConnect = async () => {
    try {
      await connect();
      message.success("Connected to wallet");
      // Fetch user balance (mocked here but should fetch from blockchain)
      setBalance(100); // Replace with a real fetch call
    } catch (error) {
      message.error("Failed to connect to wallet");
    }
  };

  const handleDisconnect = () => {
    disconnect();
    message.success("Disconnected from wallet");
    setBalance(null); // Clear balance on disconnect
  };

  return (
    <Header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#001529",
        padding: "0 20px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src="/Aptos_Primary_WHT.png"
          alt="Aptos Logo"
          style={{ height: "30px", marginRight: 16 }}
        />
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          style={{ backgroundColor: "#001529" }}
        >
          <Menu.Item key="/marketplace">
            <Link to="/marketplace" style={{ color: "#fff" }}>Marketplace</Link>
          </Menu.Item>
          <Menu.Item key="/my-nfts">
            <Link to="/my-nfts" style={{ color: "#fff" }}>My Collection</Link>
          </Menu.Item>
          <Menu.Item key="mint-nft" onClick={onMintNFTClick}>
            <span style={{ color: "#fff" }}>Mint NFT</span>
          </Menu.Item>
        </Menu>
      </div>

      <Space style={{ alignItems: "center" }}>
        {connected ? (
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="address">
                  <Text strong>Address:</Text> <br />
                  <Text copyable>{account?.address}</Text>
                </Menu.Item>
                <Menu.Item key="network">
                  <Text strong>Network:</Text> {network?.name || "Unknown"}
                </Menu.Item>
                <Menu.Item key="balance">
                  <Text strong>Balance:</Text> {balance !== null ? `${balance} APT` : "Loading..."}
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  key="logout"
                  icon={<LogoutOutlined />}
                  onClick={handleDisconnect}
                >
                  Log Out
                </Menu.Item>
              </Menu>
            }
            trigger={["click"]}
          >
            <Button type="primary">
              Connected <DownOutlined />
            </Button>
          </Dropdown>
        ) : (
          <Button type="primary" onClick={handleConnect}>
            Connect Wallet
          </Button>
        )}
      </Space>
    </Header>
  );
};

export default NavBar;