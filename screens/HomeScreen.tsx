import { useMemo, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type TodoItem = {
  id: string;
  title: string;
  completed: boolean;
};

export const routeName = 'Todo';
export const title = 'Todo List';

const initialTodos: TodoItem[] = [
  { id: '1', title: 'Read the WatermelonDB tutorial', completed: false },
  { id: '2', title: 'Build the todo UI', completed: true },
  { id: '3', title: 'Connect WatermelonDB later', completed: false },
];

export default function HomeScreen() {
  const [todos, setTodos] = useState(initialTodos);
  const [value, setValue] = useState('');
  const nextId = useRef(initialTodos.length + 1);

  const completedCount = useMemo(
    () => todos.filter((todo) => todo.completed).length,
    [todos]
  );

  const remainingCount = todos.length - completedCount;

  const addTodo = () => {
    const trimmed = value.trim();

    if (!trimmed) {
      return;
    }

    setTodos((current) => [
      {
        id: String(nextId.current++),
        title: trimmed,
        completed: false,
      },
      ...current,
    ]);
    setValue('');
  };

  const toggleTodo = (id: string) => {
    setTodos((current) =>
      current.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((current) => current.filter((todo) => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos((current) => current.filter((todo) => !todo.completed));
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-400">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View className="flex-1 px-5 pt-4">
          <View className="mb-6 rounded-3xl bg-slate-600 px-5 py-6 shadow-lg">
            <Text className="text-3xl font-bold text-white">Todo</Text>
            <Text className="mt-2 text-sm leading-5 text-slate-300">
              A simple task list for following the WatermelonDB tutorial.
            </Text>

            <View className="mt-5 flex-row gap-3">
              <View className="flex-1 rounded-2xl bg-slate-600 px-4 py-3">
                <Text className="text-xs uppercase tracking-[1.5px] text-slate-400">Remaining</Text>
                <Text className="mt-1 text-2xl font-semibold text-white">{remainingCount}</Text>
              </View>
              <View className="flex-1 rounded-2xl bg-emerald-500/15 px-4 py-3">
                <Text className="text-xs uppercase tracking-[1.5px] text-emerald-200">Completed</Text>
                <Text className="mt-1 text-2xl font-semibold text-emerald-100">{completedCount}</Text>
              </View>
            </View>
          </View>

          <View className="mb-4 rounded-3xl bg-slate-600 p-4">
            <Text className="mb-3 text-sm font-medium uppercase tracking-[2px] text-slate-400">
              New task
            </Text>
            <View className="flex-row gap-3">
              <TextInput
                value={value}
                onChangeText={setValue}
                onSubmitEditing={addTodo}
                placeholder="What needs to get done?"
                placeholderTextColor="#64748b"
                className="flex-1 rounded-2xl bg-slate-600 px-4 py-4 text-base text-white"
                returnKeyType="done"
              />
              <Pressable
                onPress={addTodo}
                className="items-center justify-center rounded-2xl bg-emerald-500 px-5"
              >
                <Text className="text-base font-semibold text-slate-700">Add</Text>
              </Pressable>
            </View>
          </View>

          <View className="mb-3 flex-row items-center justify-between px-1">
            <Text className="text-sm font-medium uppercase tracking-[2px] text-slate-100">
              Tasks
            </Text>
            <Pressable onPress={clearCompleted} disabled={completedCount === 0}>
              <Text
                className={`text-sm font-semibold ${
                  completedCount === 0 ? 'text-slate-600' : 'text-emerald-300'
                }`}
              >
                Clear completed
              </Text>
            </Pressable>
          </View>

          <FlatList
            data={todos}
            keyExtractor={(item) => item.id}
            contentContainerClassName="pb-8"
            renderItem={({ item }) => (
              <View className="mb-3 rounded-3xl bg-slate-600 px-4 py-4">
                <View className="flex-row items-start gap-3">
                  <Pressable
                    onPress={() => toggleTodo(item.id)}
                    className={`mt-1 h-6 w-6 items-center justify-center rounded-full border-2 ${
                      item.completed ? 'border-emerald-400 bg-emerald-400' : 'border-slate-600'
                    }`}
                  >
                    {item.completed ? <Text className="text-xs font-bold text-slate-950">✓</Text> : null}
                  </Pressable>

                  <Pressable onPress={() => toggleTodo(item.id)} className="flex-1">
                    <Text
                      className={`text-base font-medium ${
                        item.completed ? 'text-slate-200 line-through' : 'text-white'
                      }`}
                    >
                      {item.title}
                    </Text>
                    <Text className="mt-1 text-xs text-slate-300">
                      Tap the task or circle to toggle it
                    </Text>
                  </Pressable>

                  <Pressable onPress={() => deleteTodo(item.id)} className="rounded-full px-2 py-1">
                    <Text className="text-sm font-semibold text-rose-600">Delete</Text>
                  </Pressable>
                </View>
              </View>
            )}
            ListEmptyComponent={
              <View className="items-center rounded-3xl border border-dashed border-slate-700 bg-slate-900 px-6 py-10">
                <Text className="text-lg font-semibold text-white">No tasks yet</Text>
                <Text className="mt-2 text-center text-sm text-slate-400">
                  Add a few items above and this screen will behave like the tutorial todo list.
                </Text>
              </View>
            }
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
