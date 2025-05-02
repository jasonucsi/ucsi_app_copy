package com.ucsi_app;

import android.app.Application;
import android.content.Context;
import com.horcrux.svg.SvgPackage;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.toyberman.RNSslPinningPackage;
import org.wonday.pdf.RCTPdfView;
import com.ReactNativeBlobUtil.ReactNativeBlobUtilPackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.airbnb.android.react.lottie.LottiePackage;
import com.reactcommunity.rndatetimepicker.RNDateTimePickerPackage;
import com.rt2zz.reactnativecontacts.ReactNativeContacts;
import com.reactcommunity.rndatetimepicker.RNDateTimePickerPackage;
import org.reactnative.camera.RNCameraPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.reactnativecommunity.geolocation.GeolocationPackage;
import com.microsoft.codepush.react.CodePush;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.config.ReactFeatureFlags;
import com.facebook.soloader.SoLoader;
import com.ucsi_app.newarchitecture.MainApplicationReactNativeHost;
import java.lang.reflect.InvocationTargetException;
import java.util.List;
import com.microsoft.codepush.react.CodePush;
import com.wix.reactnativenotifications.RNNotificationsPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import android.content.BroadcastReceiver;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Build;
import javax.annotation.Nullable;

public class MainApplication extends Application implements ReactApplication {

  // private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
  // @Override
  // public boolean getUseDeveloperSupport() {
  // return BuildConfig.DEBUG;
  // }

  // @Override
  // protected List<ReactPackage> getPackages() {
  // return Arrays.<ReactPackage>asList(
  // new MainReactPackage(),
            // new RNSslPinningPackage(),
            // new RCTPdfView(),
            // new ReactNativeBlobUtilPackage(),
  // new RNTotpPackage(),
  // new LottiePackage(),
  // new ReactNativeContacts(),
  // new RNDateTimePickerPackage(),
  // new RNCameraPackage(),
  // new SplashScreenReactPackage(),
  // new SplashScreenReactPackage() //here
  // );
  // }
  // };

  // @Override
  // public ReactNativeHost getReactNativeHost() {
  // return mReactNativeHost;
  // }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      @SuppressWarnings("UnnecessaryLocalVariable")
      List<ReactPackage> packages = new PackageList(this).getPackages();
      // Packages that cannot be autolinked yet can be added manually here, for
      // example:
      // packages.add(new MyReactNativePackage());
      // packages.add(new RNDateTimePickerPackage());
      // packages.add(new RNCWebViewPackage());
      return packages;
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }

    @Override
    protected String getJSBundleFile() {
      return CodePush.getJSBundleFile();
    }
  };

  private final ReactNativeHost mNewArchitectureNativeHost = new MainApplicationReactNativeHost(this);

  @Override
  public ReactNativeHost getReactNativeHost() {
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      return mNewArchitectureNativeHost;
    } else {
      return mReactNativeHost;
    }
  }

  @Override
  public void onCreate() {
    super.onCreate();
    // If you opted-in for the New Architecture, we enable the TurboModule system
    ReactFeatureFlags.useTurboModules = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
    SoLoader.init(this, /* native exopackage */ false);
    initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
  }

  @Override
  public Intent registerReceiver(@Nullable BroadcastReceiver receiver, IntentFilter filter) {
    if (Build.VERSION.SDK_INT >= 34 && getApplicationInfo().targetSdkVersion >= 34) {
      return super.registerReceiver(receiver, filter, Context.RECEIVER_EXPORTED);
    } else {
      return super.registerReceiver(receiver, filter);
    }
  }

  /**
   * Loads Flipper in React Native templates. Call this in the onCreate method
   * with something like initializeFlipper(this,
   * getReactNativeHost().getReactInstanceManager());
   *
   * @param context
   * @param reactInstanceManager
   */
  private static void initializeFlipper(Context context, ReactInstanceManager reactInstanceManager) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         * We use reflection here to pick up the class that initializes Flipper, since
         * Flipper library is not available in release mode
         */
        Class<?> aClass = Class.forName("com.ucsi_app.ReactNativeFlipper");
        aClass.getMethod("initializeFlipper", Context.class, ReactInstanceManager.class).invoke(null, context,
            reactInstanceManager);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }
}
