import {Tabs} from 'expo-router';
import NavBar from "../../components/layout/NavBar";

export default function TabsLayout() {
    return(
      <Tabs screenOptions={{headerShown: false}}
            tabBar={props => <NavBar {...props} />}

      >
          <Tabs.Screen name="index" options={{title: 'Explore'}} />
          <Tabs.Screen name="pub-runs" options={{title: 'Pub runs'}} />
          <Tabs.Screen name="saved" options={{title: 'Saved'}} />
          <Tabs.Screen name="activity" options={{title: 'Activity'}} />
          <Tabs.Screen name="profile" options={{title: 'Profile'}} />
      </Tabs>
    );
}