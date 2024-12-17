import { Text, View } from "react-native";

interface ITextWithNote {
  text: string;
  note?: string | null;
  color: string;
}

export default function TextWithNote({ text, note, color }: ITextWithNote) {
  return (
    <View style={{ display: "flex", justifyContent: "space-between", gap: 3 }}>
      <Text style={{ fontSize: 18, color: color }}>{text}</Text>

      {note && <Text style={{ color: color, fontSize: 14 }}>Note: {note}</Text>}
    </View>
  );
}
