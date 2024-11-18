# Keep Reanimated classes and methods
-keep class com.swmansion.reanimated.** { *; }

# Keep React Native and Hermes classes
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }

# Keep React Native JSI interfaces and methods
-keep class com.facebook.jni.** { *; }
-keep class com.facebook.proguard.annotations.DoNotStrip
-keep class com.facebook.react.turbomodule.** { *; }
-keep class com.facebook.react.bridge.** { *; }
-keepattributes *Annotation*
-keepclassmembers class * { @com.facebook.proguard.annotations.DoNotStrip *; }
