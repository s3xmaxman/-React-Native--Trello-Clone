// import ListStart from '@/components/Board/ListStart';
import ListView from "@/components/Board/ListView";
import { Colors } from "@/constants/Colors";
import { useSupabase } from "@/context/SupabaseContext";
import { Board, TaskList, TaskListFake } from "@/types/enums";
import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { Pagination } from "react-native-reanimated-carousel";
import { SafeAreaView } from "react-native-safe-area-context";

interface BoardAreaProps {
  board?: Board;
}

const BoardArea = ({ board }: BoardAreaProps) => {
  const { width, height } = useWindowDimensions();
  const ref = useRef<ICarouselInstance>(null);
  const { getBoardLists, addBoardList } = useSupabase();
  const [data, setData] = useState<Array<TaskList | TaskListFake>>([
    { id: undefined },
  ]);
  const [startListActive, setStartListActive] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
      <Carousel
        data={data}
        width={width}
        height={height}
        loop={false}
        ref={ref}
        renderItem={({ index, item }: any) => (
          <>
            {item.id && <></>}
            {item.id === undefined && (
              <View
                key={index}
                style={{ paddingTop: 20, paddingHorizontal: 30 }}
              >
                {!startListActive && (
                  <TouchableOpacity
                    onPress={() => setStartListActive(true)}
                    style={styles.listAddBtn}
                  >
                    <Text style={{ color: Colors.fontLight, fontSize: 18 }}>
                      追加
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  listAddBtn: {
    backgroundColor: "#00000047",
    height: 44,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default BoardArea;
