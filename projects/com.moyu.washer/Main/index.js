/**
 * The examples provided by Facebook are for non-commercial testing and
 * evaluation purposes only.
 *
 * Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
'use strict';

// ART的demo }
import TitleBar from "miot/ui/TitleBar";
import React from 'react';
import { createStackNavigator } from 'react-navigation'; //
import { MoreSetting } from "miot/ui/CommonSetting";
import MainPage from './MainPage';
import WasherModel from "./WasherModel";
import MHSetting from "./MHSetting";
import Setting from './Setting';
import WashEdit from './WashEdit';
import WasherReport from './WasherReport';

const RootStack = createStackNavigator({
  Home: MainPage,
  WasherModel: WasherModel,
  MHSetting: MHSetting,
  Setting: Setting,
  MoreSetting: MoreSetting,
  WashEdit: WashEdit,
  WasherReport: WasherReport,
},
  {
    // ThirdPartyDemo
    initialRouteName: 'Home',
    // initialRouteName: 'ModeCardDemo',
    navigationOptions: ({ navigation }) => {
      return {
        header: <TitleBar
          title={navigation.state.params ? navigation.state.params.title : ''}
          // style={{ backgroundColor: '#fff' }}
          type='dark'
          onPressLeft={() => {
            navigation.goBack();
          }} />,
      };
    },
    transitionConfig: () => ({
      screenInterpolator: interpolator,
    }),
  });


function interpolator (props) {
  const { layout, position, scene } = props;

  if (!layout.isMeasured) {
    return (props) => {
      const { navigation, scene } = props;

      const focused = navigation.state.index === scene.index;
      const opacity = focused ? 1 : 0;
      // If not focused, move the scene far away.
      const translate = focused ? 0 : 1000000;
      return {
        opacity,
        transform: [{ translateX: translate }, { translateY: translate }],
      };
    };
  }
  const interpolate = (props) => {
    const { scene, scenes } = props;
    const index = scene.index;
    const lastSceneIndexInScenes = scenes.length - 1;
    const isBack = !scenes[lastSceneIndexInScenes].isActive;

    if (isBack) {
      const currentSceneIndexInScenes = scenes.findIndex(item => item === scene);
      const targetSceneIndexInScenes = scenes.findIndex(item => item.isActive);
      const targetSceneIndex = scenes[targetSceneIndexInScenes].index;
      const lastSceneIndex = scenes[lastSceneIndexInScenes].index;

      if (
        index !== targetSceneIndex &&
        currentSceneIndexInScenes === lastSceneIndexInScenes
      ) {
        return {
          first: Math.min(targetSceneIndex, index - 1),
          last: index + 1,
        };
      } else if (
        index === targetSceneIndex &&
        currentSceneIndexInScenes === targetSceneIndexInScenes
      ) {
        return {
          first: index - 1,
          last: Math.max(lastSceneIndex, index + 1),
        };
      } else if (
        index === targetSceneIndex ||
        currentSceneIndexInScenes > targetSceneIndexInScenes
      ) {
        return null;
      } else {
        return { first: index - 1, last: index + 1 };
      }
    } else {
      return { first: index - 1, last: index + 1 };
    }
  };

  if (!interpolate) return { opacity: 0 };
  const p = interpolate(props);
  if (!p) return;
  const { first, last } = p
  const index = scene.index;
  const opacity = position.interpolate({
    inputRange: [first, first + 0.01, index, last - 0.01, last],
    outputRange: [0, 1, 1, 0.85, 0],
  });

  const width = layout.initWidth;
  const translateX = position.interpolate({
    inputRange: [first, index, last],
    outputRange: false ? [-width, 0, width * 0.3] : [width, 0, width * -0.3],
  });
  const translateY = 0;

  return {
    opacity,
    transform: [{ translateX }, { translateY }],
  };
};

export default class App extends React.Component {
  render () {
    return <RootStack />;
  }

}
