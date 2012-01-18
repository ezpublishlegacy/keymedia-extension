<?php

namespace ezr_keymedia\tests\models\image;

use \ezr_keymedia\models\image\Handler;
use \eZContentObjectAttribute;

class HandlerTest extends \PHPUnit_Framework_TestCase
{
    public function testMediaOnEmptyAttributeFailes()
    {
        $values = array();
        $attributeMock = $this->getMock('eZContentObjectAttribute', array('attribute'));
        // First time calling attribute('data_text') it should be empty
        $attributeMock->expects($this->any())
            ->method('attribute')
            ->with('data_text')
            ->will($this->returnValue($values));
        $attributeMock->DataText = json_encode($values);

        $handler = new Handler($attributeMock);
        $media = $handler->media('named-format');
        $this->assertNull($media);
    }
    
    public function testGetMedia()
    {
        return;
        $values = array(
            'id' => 123,
            'host' => 'test.com',
            'ending' => 'jpg'
        );
        $attributeMock = $this->getMock('eZContentObjectAttribute', array('attribute'));
        // First time calling attribute('data_text') it should be empty
        $attributeMock->expects($this->any())
            ->method('attribute')
            ->with('data_text')
            ->will($this->returnValue($values));

        $handler = new Handler($attributeMock);
        $media = $handler->media(array(100, 100));
        print_r($media);
        $this->assertNotNull($media);
    }
}