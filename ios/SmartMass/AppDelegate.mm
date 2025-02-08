#import "AppDelegate.h"
#import <Firebase.h>
#import <React/RCTBundleURLProvider.h>
#import <GoogleSignIn/GoogleSignIn.h>
#import <React/RCTLinkingManager.h>
#import <RNBranch/RNBranch.h> // Импорт Branch.io

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"Smart Mass";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  // Инициализация Firebase
  if ([FIRApp defaultApp] == nil) {
    [FIRApp configure];
  }

  // Инициализация Branch.io
  [RNBranch initSessionWithLaunchOptions:launchOptions isReferrable:YES];

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey, id> *)options {
  // Обработка ссылок для Google Sign-In
  if ([GIDSignIn.sharedInstance handleURL:url]) {
    return YES;
  }

  // Обработка ссылок для Branch.io
  if ([RNBranch application:application openURL:url options:options]) {
    return YES;
  }

  // Обработка ссылок для React Native Linking
  return [RCTLinkingManager application:application openURL:url options:options];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self getBundleURL];
}

- (NSURL *)getBundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

// Добавление обработки Universal Links
- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray *))restorationHandler {
  // Обработка Universal Links для Branch.io
  if ([RNBranch continueUserActivity:userActivity]) {
    return YES;
  }

  // Обработка Universal Links для React Native Linking
  return [RCTLinkingManager application:application continueUserActivity:userActivity restorationHandler:restorationHandler];
}

@end
