import { useState } from "react";
import { Card, InputNumber, Button, Typography } from "antd";

const { Title, Text } = Typography;

export default function Bai1() {
  const [secret, setSecret] = useState(Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState<number | null>(null);
  const [turn, setTurn] = useState(0);
  const [result, setResult] = useState("");

  const handleGuess = () => {
    if (guess === null) return;

    const newTurn = turn + 1;
    setTurn(newTurn);

    if (guess < secret) {
      setResult("Bạn đoán quá thấp!");
    } else if (guess > secret) {
      setResult("Bạn đoán quá cao!");
    } else {
      setResult("Chúc mừng! Bạn đã đoán đúng!");
      return;
    }

    if (newTurn === 10) {
      setResult(`Bạn đã hết lượt! Số đúng là ${secret}`);
    }
  };

  return (
    <Card style={{ maxWidth: 400 }}>
      <Title level={3}>Game đoán số</Title>

      <Text>Nhập số từ 1 đến 100</Text>
      <br /><br />

      <InputNumber
        min={1}
        max={100}
        value={guess}
        onChange={(v) => setGuess(v)}
        style={{ width: "100%" }}
      />

      <br /><br />

      <Button type="primary" onClick={handleGuess}>
        Đoán
      </Button>

      <br /><br />

      <Text>Lượt đoán: {turn}/10</Text>
      <br />
      <Text>{result}</Text>
    </Card>
  );
}