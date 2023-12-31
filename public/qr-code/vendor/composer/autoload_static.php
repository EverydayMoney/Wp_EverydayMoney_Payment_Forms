<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInit339412c01a8f7ecba5b3be4c2719be71
{
    public static $prefixLengthsPsr4 = array (
        'c' => 
        array (
            'chillerlan\\Settings\\' => 20,
            'chillerlan\\QRCode\\' => 18,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'chillerlan\\Settings\\' => 
        array (
            0 => __DIR__ . '/..' . '/chillerlan/php-settings-container/src',
        ),
        'chillerlan\\QRCode\\' => 
        array (
            0 => __DIR__ . '/..' . '/chillerlan/php-qrcode/src',
        ),
    );

    public static $classMap = array (
        'Composer\\InstalledVersions' => __DIR__ . '/..' . '/composer/InstalledVersions.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInit339412c01a8f7ecba5b3be4c2719be71::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInit339412c01a8f7ecba5b3be4c2719be71::$prefixDirsPsr4;
            $loader->classMap = ComposerStaticInit339412c01a8f7ecba5b3be4c2719be71::$classMap;

        }, null, ClassLoader::class);
    }
}
