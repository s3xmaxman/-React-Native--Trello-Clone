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
import ListStart from "./ListStart";

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
  const scrollOffsetValue = useSharedValue<number>(0);
  const progress = useSharedValue<number>(0);

  useEffect(() => {
    loadBoardLists();
  }, [board]);

  const loadBoardLists = async () => {
    if (!board) return;
    const lists = await getBoardLists!(board!.id);
    setData([...lists, { id: undefined }]);
  };

  const onSaveNewList = async (title: string) => {
    setStartListActive(false);
    const { data: newItem } = await addBoardList!(board!.id, title);
    data.pop();
    setData([...data, newItem, { id: undefined }]);
  };

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
      <Carousel
        width={width}
        height={height}
        loop={false}
        ref={ref}
        onProgressChange={progress}
        defaultScrollOffsetValue={scrollOffsetValue}
        data={data}
        pagingEnabled={true}
        renderItem={({ index, item }: any) => (
          <>
            {item.id && <Text>{item.title}</Text>}
            {item.id === undefined && (
              <View
                key={index}
                style={{ paddingTop: 20, paddingHorizontal: 30 }}
              >
                {startListActive && (
                  <ListStart
                    onCancel={() => setStartListActive(false)}
                    onSave={onSaveNewList}
                  />
                )}
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
      <Pagination.Basic
        progress={progress}
        data={data}
        dotStyle={{ backgroundColor: "#ffffff5c", borderRadius: 40 }}
        size={8}
        activeDotStyle={{ backgroundColor: "#fff" }}
        containerStyle={{ gap: 10, marginTop: 10 }}
        onPress={onPressPagination}
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
