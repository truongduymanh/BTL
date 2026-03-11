import { useState } from "react";
import { Card, Button, Space, Table } from "antd";

export default function Bai1() {
  const choices = ["Búa", "Bao", "Kéo"];

  const [history, setHistory] = useState<any[]>([]);

  const getResult = (player: string, computer: string) => {
    if (player === computer) return "Hòa";

    if (
      (player === "Búa" && computer === "Kéo") ||
      (player === "Kéo" && computer === "Bao") ||
      (player === "Bao" && computer === "Búa")
    ) {
      return "Thắng";
    }

    return "Thua";
  };

  const play = (playerChoice: string) => {
    const computerChoice =
      choices[Math.floor(Math.random() * choices.length)];

    const result = getResult(playerChoice, computerChoice);

    const newRound = {
      key: Date.now(),
      player: playerChoice,
      computer: computerChoice,
      result: result,
    };

    setHistory([newRound, ...history]);
  };

  const columns = [
    {
      title: "Bạn",
      dataIndex: "player",
    },
    {
      title: "Máy",
      dataIndex: "computer",
    },
    {
      title: "Kết quả",
      dataIndex: "result",
    },
  ];

  return (
    <Card title="Trò chơi Oẳn Tù Tì">
      <Space style={{ marginBottom: 20 }}>
        <Button type="primary" onClick={() => play("Búa")}>
          Búa
        </Button>

        <Button type="primary" onClick={() => play("Bao")}>
          Bao
        </Button>

        <Button type="primary" onClick={() => play("Kéo")}>
          Kéo
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={history}
        pagination={false}
      />
    </Card>
  );
}