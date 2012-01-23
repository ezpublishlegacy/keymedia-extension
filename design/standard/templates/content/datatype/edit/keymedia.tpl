{def $base='ContentObjectAttribute'
    $handler = $attribute.content
    $image = $handler.image
    $backend = $handler.backend
    $class_attribute = $handler.class
    $size = ezini( 'KeyMedia', 'EditSize', 'keymedia.ini' )
}

{run-once}
{ezcss( array('jquery.jcrop.css', 'keymedia.css') )}
{ezscript_require( array(
    'ezjsc::jquery',
    'libs/underscore-min.js',
    'libs/backbone-min.js',
))}
{ezscript( array(
    'plupload/plupload.js',
    'plupload/plupload.html4.js',
    'plupload/plupload.html5.js',

    'jquery.jcrop.min.js',
    'ns.js',
    'models/KeyMedia.js',
    'models/Image.js',

    'views/Modal.js',
    'views/KeyMedia.js',
    'views/Scalebox.js',
    'views/Scaler.js',
    'views/Browser.js',
    'views/Upload.js',
    'views/Tagger.js',

    'keymedia.js',
) )}
{/run-once}

<div class="keymedia-type" data-bootstrap-image='{$image.data|json}'>

    {include uri="design:parts/edit_preview.tpl" attribute=$attribute}

    <div id="keymedia-buttons-{$attribute.id}" class="keymedia-buttons"
        data-prefix={'/ezjscore/call'|ezurl}
        data-id={$attribute.id}
        data-contentobject-id={$attribute.contentobject_id}
        data-backend={$backend.id}
        data-version={$attribute.version}>

        <input type="hidden" name="{$base}_image_id_{$attribute.id}" value="{$image.id}" class="image-id" />
        <input type="hidden" name="{$base}_host_{$attribute.id}" value="{$image.host}" class="image-host" />
        <input type="hidden" name="{$base}_ending_{$attribute.id}" value="{$image.ending}" class="image-ending" />

        <input type="button" class="keymedia-scale hid button"
            data-truesize='{$image.size|json}'
            {if $handler.imageFits}
            value="{'Scale'|i18n( 'content/edit' )}"
            {else}
            disabled="disabled"
            value="{'Image to small, change it'|i18n( 'content/edit' )}"
            {/if}
            data-versions='{$handler.toscale|json}'>

        <input type="button" class="keymedia-remote-file button" value="{'Choose from KeyMedia'|i18n( 'content/edit' )}">

        <div class="keymedia-local-file-container" id="keymedia-local-file-container-{$attribute.id}">
            <input type="button" class="keymedia-local-file button" id="keymedia-local-file-{$attribute.id}"
                value="{'Choose from computer'|i18n( 'content/edit' )}">
        </div>

        <div class="upload-progress hid" id="keymedia-progress-{$attribute.id}">
            <div class="progress"></div>
        </div>
    </div>
</div>
